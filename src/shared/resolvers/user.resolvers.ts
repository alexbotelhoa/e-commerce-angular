import { GQLUserInterest, GQLUserResolvers } from "../../resolvers-types"
import { UserEntity, USER_TABLE } from "../../entities/user.entity";
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";
import { UserRoleEntity } from "../../entities/user-role.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { selectUserRole } from "../repositories/user-role.repository";
import { getRoleById } from "../../domain/authorization/constants/roles.constants";
import { RoleId } from "../../domain/authorization/enums/role-id.enum";
import { countActivityTimers } from "../repositories/activity-timer.repository";
import { CountObj } from "../types/count-obj.type";
import { createDataloaderCountSort } from "../utils/dataloader-count-sort";
import { countCycleActivities } from "../repositories/cycle-activity.repository";
import { CYCLE_TABLE } from "../../entities/cycle.entity";
import { CYCLE_ACTIVITY_TABLE } from "../../entities/cycle-activity.entity";
import { LEVEL_THEME_TABLE } from "../../entities/level-theme.entity";
import { LEVEL_TABLE, LevelEntity } from "../../entities/level.entity";
import { LEVEL_CODE_TABLE } from "../../entities/level-code.entity";
import { ENROLLMENT_TABLE } from "../../entities/enrollment.entity";
import { TeacherClassEntity, TEACHER_CLASS_TABLE } from "../../entities/teacher-class.entity"
import { LevelTypeId } from "../../domain/activity/enums/level-type.enum";
import { AvatarEntity } from "../../entities/avatar.entity";
import { getAvatarsByIds } from "../repositories/avatar.repository";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { totalProgressChecksByClassIdLoader } from "../../domain/activity/resolvers/user/user.total-progress-checks-completed-for-class.resolver";
import { selectUserInterest } from "../repositories/user-interest.repository";
import { getInterestById } from "../repositories/interest.repository";
import { ACTIVITY_TIMER_TABLE } from "../../entities/activities/activity-timer.entity";
import { ACTIVITY_TABLE } from "../../entities/activity.entity";
import { selectEnrollmentClass } from "../repositories/enrollment-class.repository";
import { selectEnrollment } from "../repositories/enrollment.repository";
import { selectMeeting } from "../repositories/meeting.repository";
import { eventProcess } from "../../domain/user/services/event-process.service";
import { getUserById } from "../repositories/user.repository";
import { selectTeacherClass } from "../repositories/teacher-class.repository";
import { getClassById, getClassesByIds } from "../repositories/class.repository";
import { getLevelCodeById } from "../repositories/level-code.repository";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    onboarded: obj => obj.onboarded,
    avatarId: obj => obj.avatarId?.toString(10) || null,
    macId: obj => obj.macId || null,
    macPass: obj => obj.macPass || null,
    accountId: obj => obj.accountId || null,
}

const userUserRoleSorter = createDataloaderMultiSort<UserRoleEntity, string>('userId');

const userUserRoleDataloader: DatabaseLoaderFactory<string, UserRoleEntity[]> = {
    id: 'userUserRoleByUserId',
    batchFn: db => async (ids) => {
        const entities = await selectUserRole(db).whereIn('userId', ids);
        const sortedEntities = userUserRoleSorter(ids)(entities);
        return sortedEntities;
    }
};

export const userUserRolesResolver: GQLUserResolvers['userRoles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(userUserRoleDataloader, undefined);
    return dataloader.load(obj.id);
}

export const userRolesResolver: GQLUserResolvers['roles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(userUserRoleDataloader, undefined);
    const userRoles = await dataloader.load(obj.id);
    return userRoles.map(userRole => getRoleById(userRole.roleId));
}

export const userInitialsResolver: GQLUserResolvers['initials'] = obj => {
    const words = obj.name.split(" ");
    const firstWord = words[0];
    const lastWord = words.length > 1
        ? words[words.length - 1]
        : '';
    const firstChar = firstWord.charAt(0);
    const lastChar = lastWord.charAt(0);
    return `${firstChar}${lastChar}`;
}


export const userIsTeacherFieldResolver: GQLUserResolvers['isTeacher'] = async (obj, params, context) => {
    const userRoles = await context.getDatabaseLoader(userUserRoleDataloader, undefined).load(obj.id);
    return userRoles.some(userRole => userRole.roleId === RoleId.TEACHER);
}

type UserActivitiesCount = CountObj & { userId: number };

export const userCountAtivitiesSorter = createDataloaderCountSort<UserActivitiesCount, string>('userId');


export const userAvailableActivitiesByIdLoader: DatabaseLoaderFactory<string, number, number> = {
    id: 'userAvailableActivitiesById',
    batchFn: (db) => async ids => {
        // This query currently has a bug that if a user is enrolled in two or more different classes for the same level, it'll
        // end up multiplicating their available activities. This is not an usual case, so I decided to leave it like this for now.
        const entities = await countCycleActivities(db)
            .select<UserActivitiesCount[]>([`${ENROLLMENT_TABLE}.userId`])
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .innerJoin(LEVEL_THEME_TABLE, `${LEVEL_THEME_TABLE}.id`, `${CYCLE_TABLE}.levelThemeId`)
            .innerJoin(LEVEL_TABLE, `${LEVEL_TABLE}.id`, `${LEVEL_THEME_TABLE}.levelId`)
            .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
            .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
            .whereIn(`${ENROLLMENT_TABLE}.userId`, ids)
            .groupBy(`${ENROLLMENT_TABLE}.userId`);
        const sorted = userCountAtivitiesSorter(ids)(entities);
        return sorted;
    },
}


export const totalAvailableActivitiesFieldResolver: GQLUserResolvers['totalAvailableActivities'] = (obj, params, context) => {
    return context.getDatabaseLoader(userAvailableActivitiesByIdLoader, undefined).load(obj.id);
}


export const userCompletedActivitiesByIdLoader: DatabaseLoaderFactory<string, number, number, { classId: string } | undefined | null> = {
    id: 'userCompletedActivitiesById',
    batchFn: (db, params) => async ids => {

        if (params) {
            const entities = await countActivityTimers(db)
                .select<UserActivitiesCount[]>(['userId'])
                .whereIn('userId', ids)
                .andWhere('completed', true)
                .andWhere("classId", params)
                .groupBy('userId');
            const sorted = userCountAtivitiesSorter(ids)(entities);
            return sorted;
        }
        const entities = await countActivityTimers(db)
            .select<UserActivitiesCount[]>(['userId'])
            .whereIn('userId', ids)
            .andWhere('completed', true)
            .groupBy('userId');
        const sorted = userCountAtivitiesSorter(ids)(entities);
        return sorted;
    },
}

const teacherClassesteacherClassesSorter = createDataloaderMultiSort<TeacherClassEntity, string>('teacherId');

const teacherClassesDataloader: DatabaseLoaderFactory<string, TeacherClassEntity[]> = {
    id: 'teacherClassesByUserId',
    batchFn: db => async (ids) => {
        const entities = await db(TEACHER_CLASS_TABLE)
            .whereIn(`${TEACHER_CLASS_TABLE}.teacherId`, ids);

        const sortedEntities = teacherClassesteacherClassesSorter(ids)(entities);
        return sortedEntities;
    }
};

export const teacherClassesFieldResolver: GQLUserResolvers['teacherClasses'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(teacherClassesDataloader, undefined);
    return dataloader.load(obj.id);
}

export const totalCompletedActivitiesFieldResolver: GQLUserResolvers['totalCompletedActivities'] = (obj, params, context) => {
    return context.getDatabaseLoader(userCompletedActivitiesByIdLoader, params.classId as any).load(obj.id);
}

export const userDefaultLevelTypeIdFieldResolver: GQLUserResolvers['defaultLevelTypeId'] = async (obj, params, context) => {
    const userId = obj.id;
    const userLevels: LevelEntity[] = await context.database
        .select(`${LEVEL_TABLE}.*`)
        .from(LEVEL_TABLE)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
        .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        .andWhere(`${ENROLLMENT_TABLE}.userId`, userId);
    const hasYoungLevel = Boolean(userLevels.find(level => level.typeId === LevelTypeId.YOUNG));
    if (hasYoungLevel) {
        return LevelTypeId.YOUNG;
    }
    return LevelTypeId.ADULT;
}

export const userAvatarByIdSorter = createDataloaderSingleSort<AvatarEntity, number, AvatarEntity>('id');

export const userAvatarByAvatarIdLoader: DatabaseLoaderFactory<number, AvatarEntity, AvatarEntity> = {
    id: 'userAvatarByAvatarIdLoader',
    batchFn: (db) => async (ids) => {
        const entities = await getAvatarsByIds(db)(ids);
        const sorted = userAvatarByIdSorter(ids)(entities);
        return sorted;
    }
}

export const userAvatarFieldResolver: GQLUserResolvers['avatar'] = async (obj, params, context) => {
    if (obj.avatarId === null) {
        return null;
    }
    return context.getDatabaseLoader(userAvatarByAvatarIdLoader, undefined).load(obj.avatarId);
}

export const totalProgressChecksByClassFieldResolver: GQLUserResolvers['totalProgressChecksCompletedForClass'] = async (obj, params, context) => {

    return context.getDatabaseLoader(totalProgressChecksByClassIdLoader, params.classId).load(obj.id);
}

export const userInterestResolver: GQLUserResolvers['userInterest'] = async (obj, params, context) => {
    const userId = obj.id;
    const userInterests = await selectUserInterest(context.database).where(`userId`, "=", userId)
    const response: GQLUserInterest[] = [];
    for await (const int of userInterests) {
        const interest = await getInterestById(context.database)(int.interestId)
        if (interest) {
            response.push({
                ...int,
                interest,
            })
        }
    }


    return response;
}

export const studentLevelResolver: GQLUserResolvers['studentLevel'] = async (obj, params, context) => {
    let totalCompletedActivities = 0;
    const result = await context.database.count().from(USER_TABLE)
        .innerJoin(`${ACTIVITY_TIMER_TABLE}`, `${ACTIVITY_TIMER_TABLE}.userId`, `${USER_TABLE}.id`)
        .innerJoin(`${CYCLE_ACTIVITY_TABLE}`, `${CYCLE_ACTIVITY_TABLE}.id`, `${ACTIVITY_TIMER_TABLE}.cycleActivityId`)
        .innerJoin(`${ACTIVITY_TABLE}`, `${ACTIVITY_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.activityId`)
        .where(`${ACTIVITY_TIMER_TABLE}.completed`, "=", 1)
        .andWhere(`${USER_TABLE}.id`, "=", obj.id)
        .andWhere(context.database.raw(`${ACTIVITY_TABLE}.name NOT LIKE '%Progress Check%'`))
    if (result.length > 0) {
        totalCompletedActivities = result[0]["count(*)"]
    }
    return {
        totalCompletedActivities
    };
}

export const meetingResolver: GQLUserResolvers['meeting'] = async (obj, params, context) => {
    const userId = obj.id;
    if (context.redisClient) {
        const response = await context.redisClient.get("meeting-" + userId)

        if (response && (JSON.parse(response).length > 0)) {
            context.logger.info(" meeting cache used for user, id: " + userId + "meeting-" + userId)

            return JSON.parse(response);
        }
    }
    // const enrollment = await selectEnrollment(context.readonlyDatabase).where(`userId`, "=", userId)
    // if (enrollment.length === 0) {
    //     return []
    // }
    // const ids = enrollment.map(i => i.id)
    // const classes = await selectEnrollmentClass(context.readonlyDatabase).whereIn("enrollmentId", ids)
    // const classIds = classes.map(c => c.classId)
    // const meetings = await selectMeeting(context.readonlyDatabase).whereIn("classId", classIds).andWhere("enabled", "=", true)
    //     .orderBy('date', 'asc')
    // const response: any[] = []

    // for (const meet of meetings) {
    //     const teacherClass = (await selectTeacherClass(context.readonlyDatabase).where(`classId`, "=", meet.classId))[0]
    //     const teacher = teacherClass?.teacherId ? await getUserById(context.readonlyDatabase)(teacherClass.teacherId) : null;
    //     const classA = teacherClass?.classId ? await getClassById(context.readonlyDatabase)(teacherClass.classId) : null;
    //     const courseName = classA?.levelCodeId ? (await getLevelCodeById(context.readonlyDatabase)(classA.levelCodeId))?.code || null : null
    //     response.push({
    //         ...meet,
    //         teacherName: teacher && teacher.name || null,
    //         courseName: courseName
    //     })
    // }
    const [result] = await context.readonlyDatabase.raw(`
    select 
	m.*, 
	teacher.name as teacherName,
    teacher.id as ProfessorId,
    lc.code as courseName,
    u.id
    from user u
    inner join enrollment e
    on e.userId = u.id
    inner join enrollment_class ec
    on ec.enrollmentId = e.id
    inner join class c
    on c.id = ec.classId
    inner join level_code lc
    on lc.id = c.levelCodeId
    inner join meeting m 
    on m.classId = c.id
    LEFT JOIN
    (
        SELECT teacher_class.classId, user.name, user.id
    FROM teacher_class, user
    WHERE teacher_class.teacherId = user.id
    GROUP BY teacher_class.classId, user.name, user.id
    -- ORDER BY teacher_class.classId, user.name
    ) AS teacher
    ON teacher.classId = ec.classId
    where u.id = ${userId}
    order by m.date ASC
    `)
    if (context.redisClient) {
        if (result.length === 0) {
            await context.redisClient.del("meeting-" + userId)
        } else {
            await context.redisClient.set("meeting-" + userId, JSON.stringify(result), 'ex', 21600)
        }
    }
    return result
}

export const eventResolver: GQLUserResolvers['event'] = async (obj, params, context) => {
    const userId = obj.id;
    if (context.redisClient) {
        const response = await context.redisClient.get("event-" + userId)

        if (response && (JSON.parse(response).length > 0)) {
            context.logger.info(" event cache used for user, id: " + userId + "event-" + userId)
            return JSON.parse(response);
        }
    }
    const event = await eventProcess(userId, context.database, context.logger)

    if (context.redisClient) {
        if (event.length === 0) {
            await context.redisClient.del("event-" + userId)
        } else {
            await context.redisClient.set("event-" + userId, JSON.stringify(event), 'ex', 120)
        }
    }
    return event as any || [];
}

export const hasEcampusResolver: GQLUserResolvers["hasEcampus"] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) return false;
    const enrollment = await selectEnrollment(context.readonlyDatabase).where(`userId`, "=", userId)
    if (enrollment.length === 0) return false;
    const ids = enrollment.map(i => i.id)
    const Enclasses = await selectEnrollmentClass(context.readonlyDatabase).whereIn("enrollmentId", ids)
    const classIds = Enclasses.map(c => c.classId)
    const classes = await getClassesByIds(context.readonlyDatabase)(classIds)
    return classes.some(c => c.hasEcampus);
}
export const hasEyoungResolver: GQLUserResolvers["hasEyoung"] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) return false;
    const enrollment = await selectEnrollment(context.readonlyDatabase).where(`userId`, "=", userId)
    if (enrollment.length === 0) return false;
    const ids = enrollment.map(i => i.id)
    const Enclasses = await selectEnrollmentClass(context.readonlyDatabase).whereIn("enrollmentId", ids)
    const classIds = Enclasses.map(c => c.classId)
    const classes = await getClassesByIds(context.readonlyDatabase)(classIds)
    return classes.some(c => c.hasEyoung);
}

export const userResolvers: GQLUserResolvers = {
    ...userEntityResolvers,
    initials: userInitialsResolver,
    userRoles: userUserRolesResolver,
    roles: userRolesResolver,
    isTeacher: userIsTeacherFieldResolver,
    teacherClasses: teacherClassesFieldResolver,
    totalCompletedActivities: totalCompletedActivitiesFieldResolver,
    totalAvailableActivities: totalAvailableActivitiesFieldResolver,
    defaultLevelTypeId: userDefaultLevelTypeIdFieldResolver,
    avatar: userAvatarFieldResolver,
    totalProgressChecksCompletedForClass: totalProgressChecksByClassFieldResolver,
    userInterest: userInterestResolver,
    studentLevel: studentLevelResolver,
    meeting: meetingResolver,
    event: eventResolver,
    hasEcampus: hasEcampusResolver,
    hasEyoung: hasEyoungResolver,
}


