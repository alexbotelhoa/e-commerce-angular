import { GQLActivitiesListByProgressOrderResolvers } from "../../resolvers-types";

interface ActivitiesListByOrderProgress {
    partId: string,
    activityId: string,
    cycleOrder: string,
}

const ActivitiesListByOrderProgressFieldResolvers: Pick<GQLActivitiesListByProgressOrderResolvers, keyof ActivitiesListByOrderProgress> = {
    activityId: obj => obj.activityId,
    partId: obj => obj.partId,
    cycleOrder: obj => obj.cycleOrder,
}

export const activitiesListResolvers: GQLActivitiesListByProgressOrderResolvers = {
    ...ActivitiesListByOrderProgressFieldResolvers,
}
