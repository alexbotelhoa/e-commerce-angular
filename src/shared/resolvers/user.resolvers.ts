import { GQLUserResolvers } from "../../resolvers-types"
import { UserEntity } from "../../entities/user.entity";
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

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    onboarded: obj => obj.onboarded,
    avatarId: obj => obj.avatarId?.toString(10) || null,
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


export const userCompletedActivitiesByIdLoader: DatabaseLoaderFactory<string, number, number> = {
    id: 'userCompletedActivitiesById',
    batchFn: (db) => async ids => {
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
    return context.getDatabaseLoader(userCompletedActivitiesByIdLoader, undefined).load(obj.id);
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

}


