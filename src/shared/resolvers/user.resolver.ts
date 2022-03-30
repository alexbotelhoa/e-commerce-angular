import { CYCLE_TABLE } from "../../entities/cycle.entity";
import { AvatarEntity } from "../../entities/avatar.entity";
import { ACTIVITY_TABLE } from "../../entities/activity.entity";
import { UserRoleEntity } from "../../entities/user-role.entity";
import { LEVEL_CODE_TABLE } from "../../entities/level-code.entity";
import { ENROLLMENT_TABLE } from "../../entities/enrollment.entity";
import { UserEntity, USER_TABLE } from "../../entities/user.entity";
import { LEVEL_THEME_TABLE } from "../../entities/level-theme.entity";
import { LEVEL_TABLE, LevelEntity } from "../../entities/level.entity";
import { CYCLE_ACTIVITY_TABLE } from "../../entities/cycle-activity.entity";
import { ACTIVITY_TIMER_TABLE } from "../../entities/activities/activity-timer.entity";
import { TeacherClassEntity, TEACHER_CLASS_TABLE } from "../../entities/teacher-class.entity";

import { CountObj } from "../types/count-obj.type";
import { getClassesByIds } from "../repositories/class.repository";
import { getAvatarsByIds } from "../repositories/avatar.repository";
import { selectMaterial } from "../repositories/material.repository";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { selectUserRole } from "../repositories/user-role.repository";
import { getInterestById } from "../repositories/interest.repository";
import { RoleId } from "../../domain/authorization/enums/role-id.enum";
import { selectEnrollment } from "../repositories/enrollment.repository";
import { LevelTypeId } from "../../domain/activity/enums/level-type.enum";
import { GQLUserInterest, GQLUserResolvers } from "../../resolvers-types";
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";
import { createDataloaderCountSort } from "../utils/dataloader-count-sort";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { selectUserInterest } from "../repositories/user-interest.repository";
import { countActivityTimers } from "../repositories/activity-timer.repository";
import { countCycleActivities } from "../repositories/cycle-activity.repository";
import { getRoleById } from "../../domain/authorization/constants/roles.constants";
import { selectEnrollmentClass } from "../repositories/enrollment-class.repository";
import { totalProgressChecksByClassIdLoader } from "../../domain/activity/resolvers/user/user.total-progress-checks-completed-for-class.resolver";
import { MATERIAL_TABLE } from "../../entities/material.entity";
import { CLASS_TABLE } from "../../entities/class.entity";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    onboarded: obj => obj.onboarded,
    avatarId: obj => obj.avatarId?.toString(10) || null,
    macId: obj => obj.macId || null,
    macPass: obj => obj.macPass || null,
    accountId: obj => obj.accountId || null,
    isAdult: obj => obj.isAdult
}

const userUserRoleSorter = createDataloaderMultiSort<UserRoleEntity, string>('userId');

const userUserRoleDataloader: DatabaseLoaderFactory<string, UserRoleEntity[]> = {
    id: 'userUserRoleByUserId',
    batchFn: db => async (ids) => {
        const entities = await selectUserRole(db).whereIn('userId', ids);
        return  userUserRoleSorter(ids)(entities);
    }
};

export const userUserRolesResolver: GQLUserResolvers['userRoles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(userUserRoleDataloader, undefined);
    return await dataloader.load(obj.id);
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

export const userCountActivitiesSorter = createDataloaderCountSort<UserActivitiesCount, string>('userId');

export const userAvailableActivitiesByIdLoader: DatabaseLoaderFactory<string, number, number> = {
    id: 'userAvailableActivitiesById',
    batchFn: (db) => async ids => {
        const entities = await countCycleActivities(db)
            .select<UserActivitiesCount[]>([`${ENROLLMENT_TABLE}.userId`])
            .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.id`, `${CYCLE_ACTIVITY_TABLE}.cycleId`)
            .innerJoin(LEVEL_THEME_TABLE, `${LEVEL_THEME_TABLE}.id`, `${CYCLE_TABLE}.levelThemeId`)
            .innerJoin(LEVEL_TABLE, `${LEVEL_TABLE}.id`, `${LEVEL_THEME_TABLE}.levelId`)
            .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
            .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
            .whereIn(`${ENROLLMENT_TABLE}.userId`, ids)
            .groupBy(`${ENROLLMENT_TABLE}.userId`);
        const sorted = userCountActivitiesSorter(ids)(entities);
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
            const sorted = userCountActivitiesSorter(ids)(entities);
            return sorted;
        }
        const entities = await countActivityTimers(db)
            .select<UserActivitiesCount[]>(['userId'])
            .whereIn('userId', ids)
            .andWhere('completed', true)
            .groupBy('userId');
        const sorted = userCountActivitiesSorter(ids)(entities);
        return sorted;
    },
}

const teacherClassesTeacherClassesSorter = createDataloaderMultiSort<TeacherClassEntity, string>('teacherId');

const teacherClassesDataloader: DatabaseLoaderFactory<string, TeacherClassEntity[]> = {
    id: 'teacherClassesByUserId',
    batchFn: db => async (ids) => {
        const entities = await db(TEACHER_CLASS_TABLE)
            .whereIn(`${TEACHER_CLASS_TABLE}.teacherId`, ids);

        const sortedEntities = teacherClassesTeacherClassesSorter(ids)(entities);
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

export const hasEcampusResolver: GQLUserResolvers["hasEcampus"] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) return false;
    const enrollment = await selectEnrollment(context.readonlyDatabase).where(`userId`, "=", userId)
    if (enrollment.length === 0) return false;
    const ids = enrollment.map(i => i.id)
    const enrollmentClasses = await selectEnrollmentClass(context.readonlyDatabase).whereIn("enrollmentId", ids)
    const classIds = enrollmentClasses.map(c => c.classId)
    const classes = await getClassesByIds(context.readonlyDatabase)(classIds)
    return classes.some(c => c.hasEcampus);
}

export const hasEyoungResolver: GQLUserResolvers["hasEyoung"] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) return false;
    const enrollment = await selectEnrollment(context.readonlyDatabase).where(`userId`, "=", userId)
    if (enrollment.length === 0) return false;
    const ids = enrollment.map(i => i.id)
    const enrollmentClasses = await selectEnrollmentClass(context.readonlyDatabase).whereIn("enrollmentId", ids)
    const classIds = enrollmentClasses.map(c => c.classId)
    const classes = await getClassesByIds(context.readonlyDatabase)(classIds)
    return classes.some(c => c.hasEyoung);
}

export const materialsResolver: GQLUserResolvers["materials"] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) return [];

    const materialsFuture = await context.readonlyDatabase
        .select(`${MATERIAL_TABLE}.*`)
        .from(MATERIAL_TABLE)
        .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${MATERIAL_TABLE}.classId`)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.id`, `${CLASS_TABLE}.levelCodeId`)
        .andWhere(`${MATERIAL_TABLE}.userId`, userId)
        .andWhereRaw(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29`)
        .orderBy(`${CLASS_TABLE}.endDate`, 'asc');

    const materialsPassed = await context.readonlyDatabase
        .select(`${MATERIAL_TABLE}.*`)
        .from(MATERIAL_TABLE)
        .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${MATERIAL_TABLE}.classId`)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.id`, `${CLASS_TABLE}.levelCodeId`)
        .andWhere(`${MATERIAL_TABLE}.userId`, userId)
        .andWhereRaw(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) > 29`)
        .orderBy(`${CLASS_TABLE}.endDate`, 'desc');

    return [...materialsFuture,...materialsPassed];
}

export const userResolvers: GQLUserResolvers = {
    ...userEntityResolvers,
    roles: userRolesResolver,
    hasEyoung: hasEyoungResolver,
    materials: materialsResolver,
    initials: userInitialsResolver,
    hasEcampus: hasEcampusResolver,
    avatar: userAvatarFieldResolver,
    userRoles: userUserRolesResolver,
    userInterest: userInterestResolver,
    studentLevel: studentLevelResolver,
    isTeacher: userIsTeacherFieldResolver,
    teacherClasses: teacherClassesFieldResolver,
    defaultLevelTypeId: userDefaultLevelTypeIdFieldResolver,
    totalAvailableActivities: totalAvailableActivitiesFieldResolver,
    totalCompletedActivities: totalCompletedActivitiesFieldResolver,
    totalProgressChecksCompletedForClass: totalProgressChecksByClassFieldResolver,
}
