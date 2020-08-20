import { GQLActivityTimerResolvers } from "../../resolvers-types";
import { ActivityTimerEntity } from "../../entities/activities/activity-timer.entity";

export const activityTimerEntityResolvers: Pick<GQLActivityTimerResolvers, keyof ActivityTimerEntity> = {
    id: obj => obj.id.toString(10),
    cycleActivityId: obj => obj.cycleActivityId.toString(10),
    userId: obj => obj.userId.toString(10),
    completionTime: obj => obj.completionTime,
    startTime: obj => obj.startTime,
    completed: obj => obj.completed,
    classId: obj => obj.classId.toString(10),
}

export const activityTimerResolvers: GQLActivityTimerResolvers = {
    ...activityTimerEntityResolvers,
}
