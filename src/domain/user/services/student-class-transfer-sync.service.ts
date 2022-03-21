import { Redis } from "ioredis";
import { FastifyLoggerInstance } from "fastify";

import { getUserById } from "../../../shared/repositories/user.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { getClassById } from "../../../shared/repositories/class.repository";
import { getLevelById } from "../../../shared/repositories/level.repository";
import { EnrollmentClassEntity } from "../../../entities/enrollment-class.entity";
import { getLevelCodeById } from "../../../shared/repositories/level-code.repository";
import { ActivityTimerEntity } from "../../../entities/activities/activity-timer.entity";
import { StudentClassTransferSyncEvent, WebhookResponse } from "../types/webhook-events.types";
import { deleteEnrollment, insertEnrollment, selectEnrollment } from "../../../shared/repositories/enrollment.repository";
import { deleteActivityTimer, insertActivityTimer, selectActivityTimer } from "../../../shared/repositories/activity-timer.repository";
import { deleteEnrollmentClass, insertEnrollmentClass, selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";

export const processStudentClassTransferSync = (
    db: DatabaseService,
    log: FastifyLoggerInstance,
    redisClient?: Redis
) => async (event: StudentClassTransferSyncEvent): Promise<WebhookResponse> => {
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

    const user = await getUserById(db)(userId);
    if (!user) {
        return {
            message: "User Don't found.",
            success: false,
        };
    }

    await transferEnrollment(db, userId, existingLevelCode, data.oldClassId, newClassId, log, event);
    if (redisClient) {
        await redisClient.del("meeting-" + userId);
    }

    return {
        success: true,
    };
}

async function transferEnrollment(
    db: DatabaseService,
    userId: string,
    levelData: {
        id: number;
        code: string;
    },
    oldClassId: string,
    newClassId: string,
    log: FastifyLoggerInstance,
    event: StudentClassTransferSyncEvent
) {
    let enrollmentId: number;
    const enrollments = await selectEnrollment(db).andWhere('userId', userId).andWhere('levelCodeId', levelData.id);
    if (enrollments.length == 1) {
        enrollmentId = enrollments[0].id;
    } else {
        if (enrollments.length > 1) {
            const ids = enrollments.map(i => i.id);
            const enrollmentsClasses = await selectEnrollmentClass(db).whereIn("enrollmentId", ids);
            const enrollmentClassesId = enrollmentsClasses.map(item => item.id);

            await deleteEnrollment(db)(builder => builder.whereIn("id", ids));
            await deleteEnrollmentClass(db)(builder => builder.whereIn("id", enrollmentClassesId));

            enrollmentId = await insertEnrollment(db)({ levelCodeId: levelData.id, userId: userId });
            const enrollmentClassToCreate: Partial<EnrollmentClassEntity>[] = enrollmentsClasses.map(i => {
                return {
                    classId: i.classId,
                    enrollmentId: enrollmentId,
                }
            });

            await insertEnrollmentClass(db)(enrollmentClassToCreate);
        } else {
            enrollmentId = await insertEnrollment(db)({ levelCodeId: levelData.id, userId: userId });
        }
    }
    
    const oldClass = await getClassById(db)(oldClassId);
    if (oldClass?.levelCodeId) {
        const oldLevelCode = await getLevelCodeById(db)(oldClass?.levelCodeId);
        if (oldLevelCode?.id) {
            const enrollmentsOfOldClass = await selectEnrollment(db).andWhere('userId', userId).andWhere('levelCodeId', oldLevelCode.id);
            const enrollmentsIdsOfOldClasses = enrollmentsOfOldClass.map(item => item.id);
            const oldClassEnrollment = await selectEnrollmentClass(db).whereIn('enrollmentId', enrollmentsIdsOfOldClasses).andWhere('classId', oldClassId);
            if (oldClassEnrollment.length > 0) {
                await deleteEnrollmentClass(db)(builder => builder.whereIn('id', oldClassEnrollment.map(item => item.id)));
            }
        }
    }

    const [existingEnrollmentClass] = await selectEnrollmentClass(db).andWhere('classId', newClassId).andWhere('enrollmentId', enrollmentId);
    const hasToInsertEnrollmentClass = !existingEnrollmentClass;
    if (hasToInsertEnrollmentClass) {
        if (oldClass?.levelCodeId) {
            const newLevelCode = await getLevelCodeById(db)(levelData.id);
            const oldLevelCode = await getLevelCodeById(db)(oldClass?.levelCodeId);
            if (oldLevelCode && oldLevelCode.levelId && newLevelCode?.levelId) {
                const levelOldClass = await getLevelById(db)(oldLevelCode.levelId);
                const levelNewClass = await getLevelById(db)(newLevelCode?.levelId);
                if (levelOldClass?.id === levelNewClass?.id) {
                    const activitiesToTransitionToNewClass = await selectActivityTimer(db).where('classId', oldClassId).andWhere('userId', userId);
                    const activityTimerEntitiesToSave = activitiesToTransitionToNewClass.map<Omit<ActivityTimerEntity, 'id'>>(saved => ({
                        classId: newClassId,
                        completed: saved.completed,
                        completionTime: saved.completionTime,
                        cycleActivityId: saved.cycleActivityId,
                        startTime: saved.startTime,
                        userId: saved.userId,
                    }));
                    const hasToSaveActivityTimerEntities = activityTimerEntitiesToSave.length > 0;
                    if (hasToSaveActivityTimerEntities) {
                        await insertActivityTimer(db)(activityTimerEntitiesToSave);
                        await deleteActivityTimer(db)(builder => builder.where('classId', oldClassId).andWhere('userId', userId));
                    }
                }
            }
        }

        if (hasToInsertEnrollmentClass) {
            await insertEnrollmentClass(db)({ classId: newClassId, enrollmentId: enrollmentId });
        }
    } else {
        log.info(
            event as any,
            'User is already enrolled in class.',
        );
    }
}
