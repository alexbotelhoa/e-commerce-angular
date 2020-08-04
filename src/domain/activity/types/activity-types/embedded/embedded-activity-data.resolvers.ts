import { GQLEmbeddedActivityDataResolvers } from "../../../../../resolvers-types";
import { EmbeddedActivityDataEntity } from "../../../../../entities/activities/embedded-activity-data.entity";

export const embeddedActivityDataEntityResolvers: Pick<GQLEmbeddedActivityDataResolvers, keyof EmbeddedActivityDataEntity> = {
    activityId: obj => obj.activityId.toString(),
    url: obj => obj.url,
}

export const embeddedActivityDataResolvers: GQLEmbeddedActivityDataResolvers = {
    ...embeddedActivityDataEntityResolvers,
}
