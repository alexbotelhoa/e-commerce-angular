import { FastifyLoggerInstance } from "fastify";
import { ActivityTimerEntity } from "../../../entities/activities/activity-timer.entity";
import { insertActivityTimer, selectActivityTimer } from "../../../shared/repositories/activity-timer.repository";
import { getClassById, insertClass, updateClass } from "../../../shared/repositories/class.repository";
import { insertEnrollmentClass, selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";
import { insertEnrollment, selectEnrollment } from "../../../shared/repositories/enrollment.repository";
import { getLevelCodeById, insertLevelCode } from "../../../shared/repositories/level-code.repository";
import { insertUserRole, selectUserRole } from "../../../shared/repositories/user-role.repository";
import { getUserById, insertUser } from "../../../shared/repositories/user.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { RoleId } from "../../authorization/enums/role-id.enum";
import { ClassData } from "../types/class-data.type";
import { UserData } from "../types/user-data.type";
import { StudentEnrollmentEvent, WebhookResponse } from "../types/webhook-events.types";
import { isClassDataDivergent } from "./class-utils";

export interface StudentEnrollmentData {
    user: UserData;
    class: ClassData;
}

export const processStudentEnrollment = (db: DatabaseService, log: FastifyLoggerInstance) => async (event: StudentEnrollmentEvent): Promise<WebhookResponse> => {
    const data = event.data;
    const userData = data.user;
    const classData = data.class;
    const levelData = classData.level;
    const existingUser = await getUserById(db)(data.user.id);
    const existingClass = await getClassById(db)(classData.id);
    const existingLevelCode = await getLevelCodeById(db)(classData.level.id);
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
            id: classData.id,
            name: classData.name,
            institutionId: classData.institutionId,
            carrerId: classData.carrerId,
            periodId: classData.periodId,
            sessionId: classData.sessionId,
            levelCodeId: classData.level.id,
            startDate: classData.startDate,
            endDate: classData.endDate,
        })
    } else {
        if (isClassDataDivergent(existingClass, classData)) {
            await updateClass(db)({
                name: classData.name,
                institutionId: classData.institutionId,
                carrerId: classData.carrerId,
                periodId: classData.periodId,
                sessionId: classData.sessionId,
                levelCodeId: classData.level.id,
                startDate: classData.startDate,
                endDate: classData.endDate,
            })(where => where.andWhere('id', classData.id));
        }
    }
    if (!existingUser) {
        await db.transaction(async trx => {
            await insertUser(trx)({
                id: userData.id,
                name: userData.name,
                avatarId: null,
                onboarded: false,
            });
            await insertUserRole(trx)({
                roleId: RoleId.STUDENT,
                userId: userData.id,
            });
            const enrollmentId = await insertEnrollment(trx)({
                userId: userData.id,
                levelCodeId: levelData.id,
            });
            await insertEnrollmentClass(trx)({
                classId: classData.id,
                enrollmentId: enrollmentId,
            });
        })
    } else {
        const existingStudentRoles = await selectUserRole(db).andWhere('roleId', RoleId.STUDENT).andWhere('userId', userData.id);
        const [existingEnrollment] = await selectEnrollment(db).andWhere('userId', userData.id).andWhere('levelCodeId', levelData.id);

        if (existingStudentRoles.length === 0) {
            await insertUserRole(db)({
                roleId: RoleId.STUDENT,
                userId: userData.id,
            });
        }

        // no enrollments, we need to insert everything
        if (!existingEnrollment) {
            await db.transaction(async trx => {
                const enrollmentId = await insertEnrollment(trx)({
                    userId: userData.id,
                    levelCodeId: levelData.id,
                });
                await insertEnrollmentClass(trx)({
                    classId: classData.id,
                    enrollmentId: enrollmentId,
                });
            })
        } else {
            const existingEnrollmentClasses = await selectEnrollmentClass(db)
                .andWhere('enrollmentId', existingEnrollment.id);
            const isCurrentlyEnrolledInClass = Boolean(existingEnrollmentClasses
                .find(enrollmentClass => enrollmentClass.classId === classData.id))
            // enrollment exists, so we should only insert enrollment class if not already exist
            if (!isCurrentlyEnrolledInClass) {
                await insertEnrollmentClass(db)({
                    classId: classData.id,
                    enrollmentId: existingEnrollment.id,
                });
                // we need to check if the student is enrolled in other classes of the same level, 
                // to then replicate their activities to the new class
                const oldClassIds = existingEnrollmentClasses
                    .filter(enrollmentClass => enrollmentClass.classId !== classData.id)
                    .map(enrollmentClass => enrollmentClass.classId);
                const activitiesToTransitionToNewClass = await selectActivityTimer(db)
                    .whereIn('classId', oldClassIds)
                    .andWhere('userId', userData.id);
                const activityTimerEntitiesToSave = activitiesToTransitionToNewClass
                    .map<Omit<ActivityTimerEntity, 'id'>>(saved => ({
                        classId: classData.id,
                        completed: saved.completed,
                        completionTime: saved.completionTime,
                        cycleActivityId: saved.cycleActivityId,
                        startTime: saved.startTime,
                        userId: saved.userId,
                    }));

                const hasToSaveActivityTimerEntities = activityTimerEntitiesToSave.length > 0;
                if (hasToSaveActivityTimerEntities) {
                    await insertActivityTimer(db)(activityTimerEntitiesToSave);
                }
            }
        }
    }

    return {
        success: true,
    };
}
