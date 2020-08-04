import { GQLActivityTypeResolvers } from "../../resolvers-types";
import { ActivityType } from "../../domain/activity/types/activity-type.type";

export const activityTypeEntityResolvers: Pick<GQLActivityTypeResolvers, keyof ActivityType> = {
    id: obj => obj.id,
    description: obj => obj.description,
    name: obj => obj.name,
}

export const activityTypeResolvers: GQLActivityTypeResolvers = {
    ...activityTypeEntityResolvers,
}
