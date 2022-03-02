import { FastifyLoggerInstance } from "fastify";

import { RoleId } from "../../authorization/enums/role-id.enum";
import { DatabaseService } from "../../../shared/services/database.service";
import { getClassById } from "../../../shared/repositories/class.repository";
import { getLevelCodeById } from "../../../shared/repositories/level-code.repository";
import { ActivityTimerEntity } from "../../../entities/activities/activity-timer.entity";
import { StudentEnrollmentSyncEvent, WebhookResponse } from "../types/webhook-events.types";
import { deleteUserRole, insertUserRole } from "../../../shared/repositories/user-role.repository";
import { getUserById, insertUser, updateUser } from "../../../shared/repositories/user.repository";
import { insertEnrollment, selectEnrollment } from "../../../shared/repositories/enrollment.repository";
import { insertActivityTimer, selectActivityTimer } from "../../../shared/repositories/activity-timer.repository";
import { insertEnrollmentClass, selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";

interface UserData {
    id: string;
    name: string;
    macId: string | null;
    macPass: string | null;
}

export const processStudentEnrollmentSync = (
    db: DatabaseService,
    log: FastifyLoggerInstance
) => async (event: StudentEnrollmentSyncEvent): Promise<WebhookResponse> => {
    const userData = event.data.user;
    if ("ClassId" in event.data) {

        const classFound = await getClassById(db)(event.data.ClassId);
        if (!classFound) {
            return {
                message: "When passed ClassId, class must already be synced.",
                success: false,
            };
        }
        const existingLevelCode = await getLevelCodeById(db)(classFound.levelCodeId);
        if (!existingLevelCode) {
            return {
                message: "When passed ClassId, class level must already be synced.",
                success: false,
            };
        }
        const existingUser = await getUserById(db)(userData.id);
        await upsertUserAndMakeEnrollment(existingUser, db, userData, existingLevelCode, event.data.ClassId);
        return {
            success: true,
        };
    }

    return {
        success: false,
        message: "unknown error."
    };
}

async function upsertUserAndMakeEnrollment(existingUser: {
    id: string; name: string;
} | null,
    db: DatabaseService,
    userData: UserData,
    levelData: { id: number; code: string; },
    classId: string) {
    if (!existingUser) {
        await insertUser(db)({
            id: userData.id,
            name: userData.name,
            avatarId: null,
            onboarded: true,
            macId: userData.macId,
            macPass: userData.macPass,
        });

        await upsertRole(db, userData);

        const enrollmentId = await insertEnrollment(db)({
            userId: userData.id,
            levelCodeId: levelData.id,
        });

        await insertEnrollmentClass(db)({
            classId: classId,
            enrollmentId: enrollmentId,
        });
    } else {
        const [existingEnrollment] = await selectEnrollment(db).andWhere('userId', userData.id).andWhere('levelCodeId', levelData.id);
        await updateUser(db)({
            macId: userData.macId,
            macPass: userData.macPass,
            name: userData.name
        })(where => where.andWhere('id', existingUser.id));
        await upsertRole(db, userData);

        if (!existingEnrollment) {
            const enrollmentId = await insertEnrollment(db)({
                userId: userData.id,
                levelCodeId: levelData.id,
            });
            await insertEnrollmentClass(db)({
                classId: classId,
                enrollmentId: enrollmentId,
            });
        } else {
            const existingEnrollmentClasses = await selectEnrollmentClass(db)
                .andWhere('enrollmentId', existingEnrollment.id);
            const isCurrentlyEnrolledInClass = Boolean(existingEnrollmentClasses
                .find(enrollmentClass => enrollmentClass.classId === classId));
            if (!isCurrentlyEnrolledInClass) {
                await insertEnrollmentClass(db)({
                    classId: classId,
                    enrollmentId: existingEnrollment.id,
                });
                const oldClassIds = existingEnrollmentClasses
                    .filter(enrollmentClass => enrollmentClass.classId !== classId)
                    .map(enrollmentClass => enrollmentClass.classId);
                const activitiesToTransitionToNewClass = await selectActivityTimer(db)
                    .whereIn('classId', oldClassIds)
                    .andWhere('userId', userData.id);
                const activityTimerEntitiesToSave = activitiesToTransitionToNewClass
                    .map<Omit<ActivityTimerEntity, 'id'>>(saved => ({
                        classId: classId,
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
}

async function upsertRole(db: DatabaseService, userData: UserData) {
    await deleteUserRole(db)(builder => builder.andWhere({ userId: userData.id }));

    await insertUserRole(db)({
        roleId: RoleId.STUDENT,
        userId: userData.id,
    });

    await insertUserRole(db)({
        roleId: RoleId.HORIZON_ONE,
        userId: userData.id,
    });
}
