import { FastifyLoggerInstance } from "fastify";
import { ActivityTimerEntity } from "../../../entities/activities/activity-timer.entity";
import { insertActivityTimer, selectActivityTimer } from "../../../shared/repositories/activity-timer.repository";
import { getClassById } from "../../../shared/repositories/class.repository";
import { deleteEnrollmentClass, insertEnrollmentClass, selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";
import { insertEnrollment, selectEnrollment } from "../../../shared/repositories/enrollment.repository";
import { getLevelCodeById } from "../../../shared/repositories/level-code.repository";
import { getUserById } from "../../../shared/repositories/user.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { StudentClassTransferEvent, WebhookResponse } from "../types/webhook-events.types";

export const processStudentClassTransfer =
    (db: DatabaseService, log: FastifyLoggerInstance) => async (event: StudentClassTransferEvent): Promise<WebhookResponse> => {
        const data = event.data;
        const userId = data.userId;
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
        const user = await getUserById(db)(userId)
        if (!user) {
            return {
                message: "User Don't found.",
                success: false,
            };
        }
        await transferEnrollment(db, userId, existingLevelCode, data.oldClassId, newClassId, log, event);
        return {
            success: true,
        };
    }

async function transferEnrollment(db: DatabaseService, userId: string, levelData: { id: number; code: string; }, oldClassId: string, newClassId: string, log: FastifyLoggerInstance, event: StudentClassTransferEvent) {
    const enrollment = await selectEnrollment(db).andWhere('userId', userId).andWhere('levelCodeId', levelData.id).first();
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
        .andWhere('classId', newClassId)
        .andWhere('enrollmentId', enrollmentId);
    const hasToInsertEnrollmentClass = !existingEnrollmentClass;
    if (hasToInsertEnrollmentClass) {
        const activitiesToTransitionToNewClass = await selectActivityTimer(db)
            .where('classId', oldClassId)
            .andWhere('userId', userId);
        const activityTimerEntitiesToSave = activitiesToTransitionToNewClass
            .map<Omit<ActivityTimerEntity, 'id'>>(saved => ({
                classId: newClassId,
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
            if (hasToInsertEnrollmentClass) {
                await insertEnrollmentClass(db)({
                    classId: newClassId,
                    enrollmentId: enrollmentId,
                });
            }
            if (hasToSaveActivityTimerEntities) {
                await insertActivityTimer(db)(activityTimerEntitiesToSave);
            }
        }
    } else {

        log.info(event as any, 'User is already enrolled in class.');
    }

    if (hasToDeleteOldEnrollmentClass) {
        await deleteEnrollmentClass(db)(query => query.andWhere('id', oldClassEnrollment.id));
    }
}

