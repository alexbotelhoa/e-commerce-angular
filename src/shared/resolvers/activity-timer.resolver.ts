import { GQLActivityTimerResolvers } from "../../resolvers-types";
import { ActivityTimerEntity } from "../../entities/activities/activity-timer.entity";
import { getCycleActivityById } from "../repositories/cycle-activity.repository";
import { getUserById } from "../repositories/user.repository";

const activityTimerEntityResolvers: Pick<GQLActivityTimerResolvers, keyof ActivityTimerEntity> = {
    id: obj => obj.id.toString(10),
    cycleActivityId: obj => obj.cycleActivityId.toString(10),
    userId: obj => obj.userId,
    completionTime: obj => obj.completionTime,
    startTime: obj => obj.startTime,
    completed: obj => obj.completed,
    classId: obj => obj.classId,
}

export const activityTimerResolvers: GQLActivityTimerResolvers = {
    ...activityTimerEntityResolvers,
    cycleActivity: async (obj, params, context) => (await getCycleActivityById(context.database)(obj.cycleActivityId))!,
    currentUser: async (obj, params, context) => (await getUserById(context.database)(obj.userId))!,
    completedActivities: async (obj, params, context) => {
        const result = await context.database.
                            count('aT.completed', { as: 'completedActivities' }).
                            from('activity_timer as aT').
                            where('aT.userId', obj.userId).
                            andWhere('aT.classId', obj.classId).
                            andWhere('aT.completed', 1).
                            groupBy('aT.completed');
        return result[0].completedActivities;
    },
}
