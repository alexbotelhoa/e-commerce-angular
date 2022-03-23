import { CLASS_TABLE } from "../../entities/class.entity";
import { getCycleById } from "../repositories/cycle.repository";
import { ActivityEntity } from "../../entities/activity.entity";
import { GQLCycleActivityResolvers } from "../../resolvers-types";
import { selectActivity } from "../repositories/activity.repository";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { RoleId } from './../../domain/authorization/enums/role-id.enum';
import { CycleActivityEntity } from "../../entities/cycle-activity.entity";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { selectActivityTimer } from "../repositories/activity-timer.repository";
import { selectCycleActivity } from "../repositories/cycle-activity.repository";
import { ActivityTimerEntity } from "../../entities/activities/activity-timer.entity";

const cycleActivityEntityResolvers: Pick<GQLCycleActivityResolvers, keyof CycleActivityEntity> = {
    id: obj => obj.id.toString(),
    order: obj => obj.order,
    cycleId: obj => obj.cycleId.toString(),
    activityId: obj => obj.activityId.toString(),
}

export const cycleResolver: GQLCycleActivityResolvers['cycle'] = async (obj, params, context) => {
    const cycle = await getCycleById(context.database)(obj.cycleId);
    if (cycle) {
        return cycle;
    }

    throw new Error('Non-existent cycle entity!')
}

const cycleActivityActivityByIdSorter = createDataloaderSingleSort<ActivityEntity, number, ActivityEntity>('id');

const cycleActivityActivityByIdLoader: DatabaseLoaderFactory<number, ActivityEntity, ActivityEntity> = {
    id: 'cycleActivityActivityByIdLoader',
    batchFn: db => async (ids) => {
        const entities = await selectActivity(db).whereIn('id', ids);
        const result = cycleActivityActivityByIdSorter(ids)(entities);
        return result;
    }
};

export const cycleActivityActivityFieldResolver: GQLCycleActivityResolvers['activity'] = async (obj, params, context) => {
    return context.getDatabaseLoader(cycleActivityActivityByIdLoader, undefined).load(obj.activityId);
}

export const cycleActivityNextActivityFieldResolver: GQLCycleActivityResolvers['nextActivity'] = async (obj, params, context) => {
    const next = await selectCycleActivity(context.database)
        .andWhere('cycleId', obj.cycleId)
        .andWhere('order', '>=', obj.order)
        .andWhere('id', '<>', obj.id)
        .orderBy([{ column: 'order', order: 'asc' }, { column: 'id', order: 'asc' }])
        .limit(1)
        .first();
    return next || null;
};

export const cycleActivityPreviousActivityFieldResolver: GQLCycleActivityResolvers['previousActivity'] = async (obj, params, context) => {
    const previous = await selectCycleActivity(context.database)
        .andWhere('cycleId', obj.cycleId)
        .andWhere('order', '<=', obj.order)
        .andWhere('id', '<>', obj.id)
        .orderBy([{ column: 'order', order: 'desc' }, { column: 'id', order: 'desc' }])
        .limit(1)
        .first();
    return previous || null;
};

const cycleActivityUserHasCompletedSorter = createDataloaderSingleSort<ActivityTimerEntity, number, ActivityTimerEntity | undefined>('cycleActivityId');

export const cycleActivityUserHasCompletedLoader: DatabaseLoaderFactory<number, boolean, boolean, string> = {
    id: 'cycleActivityUserHasCompleted',
    batchFn: (db, userId) => async (cycleActivityIds) => {
        const entities = await selectActivityTimer(db)
            .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `classId`)
            .whereIn('cycleActivityId', cycleActivityIds)
            .andWhere('userId', userId)
            .andWhere('completed', true)
            .andWhereRaw(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29`)
            .andWhereRaw(`DATEDIFF(${CLASS_TABLE}.startDate, CURDATE()) < 31`);
        
        const sorted = cycleActivityUserHasCompletedSorter(cycleActivityIds)(entities);
        return sorted.map(Boolean);
    }
}

export const cycleActivityUserHasCompletedLoaderTeacher: DatabaseLoaderFactory<number, boolean, boolean, string> = {
    id: 'cycleActivityUserHasCompleted',
    batchFn: (db, userId) => async (cycleActivityIds) => {
        const entities = await selectActivityTimer(db)
            .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `classId`)
            .whereIn('cycleActivityId', cycleActivityIds)
            .andWhere('userId', userId)
            .andWhere('completed', true);
        
        const sorted = cycleActivityUserHasCompletedSorter(cycleActivityIds)(entities);
        return sorted.map(Boolean);
    }
}

const cycleActivityViewerHasCompletedFieldResolver: GQLCycleActivityResolvers['viewerHasCompleted'] = async (obj, params, context) => {
    const user = context.currentUser;
    const isTeacher = user?.roleIds.includes(RoleId.TEACHER)

    if (!user) {
        return false;
    }

    return context.getDatabaseLoader(isTeacher ? cycleActivityUserHasCompletedLoaderTeacher : cycleActivityUserHasCompletedLoader, user.id).load(obj.id);
}

const cycleActivityStudentHasCompletedFieldResolver: GQLCycleActivityResolvers['studentHasCompleted'] = async (obj, params, context) => {
    const isTeacher = context.currentUser?.roleIds.includes(RoleId.TEACHER);
    return context.getDatabaseLoader(isTeacher ? cycleActivityUserHasCompletedLoaderTeacher : cycleActivityUserHasCompletedLoader, params.studentId).load(obj.id);
}

export const cycleActivityResolvers: GQLCycleActivityResolvers = {
    ...cycleActivityEntityResolvers,
    cycle: cycleResolver,
    activity: cycleActivityActivityFieldResolver,
    nextActivity: cycleActivityNextActivityFieldResolver,
    previousActivity: cycleActivityPreviousActivityFieldResolver,
    viewerHasCompleted: cycleActivityViewerHasCompletedFieldResolver,
    studentHasCompleted: cycleActivityStudentHasCompletedFieldResolver,
}
