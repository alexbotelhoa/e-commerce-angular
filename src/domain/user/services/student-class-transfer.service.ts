import { FastifyLoggerInstance } from "fastify";
import { ActivityTimerEntity } from "../../../entities/activities/activity-timer.entity";
import { insertActivityTimer, selectActivityTimer } from "../../../shared/repositories/activity-timer.repository";
import { getClassById, insertClass, updateClass } from "../../../shared/repositories/class.repository";
import { deleteEnrollmentClass, insertEnrollmentClass, selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";
import { insertEnrollment, selectEnrollment } from "../../../shared/repositories/enrollment.repository";
import { getLevelCodeById, insertLevelCode } from "../../../shared/repositories/level-code.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { StudentClassTransferEvent, WebhookResponse } from "../types/webhook-events.types";
import { isClassDataDivergent } from "./class-utils";

export const processStudentClassTransfer =
    (db: DatabaseService, log: FastifyLoggerInstance) => async (event: StudentClassTransferEvent): Promise<WebhookResponse> => {
        const data = event.data;
        const userId = data.userId;
        if ("newClass" in data) {
            const oldClassId = data.oldClassId;
            const newClass = data.newClass;
            const levelData = newClass.level;
            const existingClass = await getClassById(db)(newClass.id);
            const existingLevelCode = await getLevelCodeById(db)(newClass.level.id);
            if (!existingLevelCode) {
                await insertLevelCode(db)({
                    id: levelData.id,
                    active: true,
                    code: levelData.code,
                    description: levelData.code,
                    levelId: null,
                });
            }
            if (!existingClass) {
                await insertClass(db)({
                    id: newClass.id,
                    name: newClass.name,
                    institutionId: newClass.institutionId,
                    carrerId: newClass.carrerId,
                    periodId: newClass.periodId,
                    sessionId: newClass.sessionId,
                    levelCodeId: newClass.level.id,
                    startDate: newClass.startDate,
                    endDate: newClass.endDate,
                })
            } else {
                if (isClassDataDivergent(existingClass, newClass)) {
                    await updateClass(db)({
                        name: newClass.name,
                        carrerId: newClass.carrerId,
                        institutionId: newClass.institutionId,
                        periodId: newClass.periodId,
                        sessionId: newClass.sessionId,
                        levelCodeId: newClass.level.id,
                        startDate: newClass.startDate,
                        endDate: newClass.endDate,
                    })(where => where.andWhere('id', newClass.id));
                }
            }

            await transferEnrollment(db, userId, levelData, oldClassId, newClass, log, event);
            return {
                success: true,
            };
        }

        if ("newClassId" in data) {
            const newClassId = data.newClassId;
            const existingClass = await getClassById(db)(newClassId);
            if (!existingClass) {
                return {
                    message: "When passed newClassId, class must already be synced.",
                    success: false,
                };
            }
            const existingLevelCode = await getLevelCodeById(db)(existingClass.levelCodeId);
            if (!existingLevelCode) {
                return {
                    message: "When passed newClassId, class level must already be synced.",
                    success: false,
                };
            }
            await transferEnrollment(db, userId, existingLevelCode, data.oldClassId, {
                ...existingClass,
                endDate: existingClass.endDate instanceof Date ? existingClass.endDate?.toString() : existingClass.endDate,
                startDate: existingClass.startDate instanceof Date ? existingClass.startDate?.toString() : existingClass.startDate
            }, log, event);
            return {
                success: true,
            };
        }
        return {
            success: false,
            message: "unknown error."
        };
    }

async function transferEnrollment(db: DatabaseService, userId: string, levelData: { id: number; code: string; }, oldClassId: string, newClass: { id: string; name: string; institutionId: string | null; periodId: string | null; sessionId: string | null; carrerId: string | null; startDate: string | null; endDate: string | null; }, log: FastifyLoggerInstance, event: StudentClassTransferEvent) {
    const [enrollment] = await selectEnrollment(db).andWhere('userId', userId).andWhere('levelCodeId', levelData.id);
    let enrollmentId: number;
    if (enrollment) {
        enrollmentId = enrollment.id;
    } else {
        enrollmentId = await insertEnrollment(db)({
            levelCodeId: levelData.id,
            userId: userId,
        });
    }

    const [oldClassEnrollment] = await selectEnrollmentClass(db)
        .andWhere('classId', oldClassId)
        .andWhere('enrollmentId', enrollmentId);

    const hasToDeleteOldEnrollmentClass = Boolean(oldClassEnrollment);

    const [existingEnrollmentClass] = await selectEnrollmentClass(db)
        .andWhere('classId', newClass.id)
        .andWhere('enrollmentId', enrollmentId);
    const hasToInsertEnrollmentClass = !existingEnrollmentClass;
    if (hasToInsertEnrollmentClass) {
        const activitiesToTransitionToNewClass = await selectActivityTimer(db)
            .where('classId', oldClassId)
            .andWhere('userId', userId);
        const activityTimerEntitiesToSave = activitiesToTransitionToNewClass
            .map<Omit<ActivityTimerEntity, 'id'>>(saved => ({
                classId: newClass.id,
                completed: saved.completed,
                completionTime: saved.completionTime,
                cycleActivityId: saved.cycleActivityId,
                startTime: saved.startTime,
                userId: saved.userId,
            }));

        const hasToSaveActivityTimerEntities = activityTimerEntitiesToSave.length > 0;

        // checking if we need to do anything at all
        if (hasToSaveActivityTimerEntities
            || hasToInsertEnrollmentClass
            || hasToDeleteOldEnrollmentClass) {
            await db.transaction(async (trx) => {
                if (hasToInsertEnrollmentClass) {
                    await insertEnrollmentClass(trx)({
                        classId: newClass.id,
                        enrollmentId: enrollmentId,
                    });
                }
                if (hasToSaveActivityTimerEntities) {
                    await insertActivityTimer(trx)(activityTimerEntitiesToSave);
                }
                if (hasToDeleteOldEnrollmentClass) {
                    await deleteEnrollmentClass(trx)(query => query.andWhere('id', oldClassEnrollment.id));
                }
            });
        }
    } else {
        log.info(event as any, 'User is already enrolled in class.');
    }
}

