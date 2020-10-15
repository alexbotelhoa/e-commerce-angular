import { GQLActivityTimerResolvers } from "../../resolvers-types";
import { ActivityTimerEntity } from "../../entities/activities/activity-timer.entity";
import { getCycleActivityById } from "../repositories/cycle-activity.repository";

export const activityTimerEntityResolvers: Pick<GQLActivityTimerResolvers, keyof ActivityTimerEntity> = {
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
}
