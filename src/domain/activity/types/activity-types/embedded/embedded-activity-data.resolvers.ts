import { GQLEmbeddedActivityDataResolvers } from "../../../../../resolvers-types";
import { EmbeddedActivityDataEntity } from "../../../../../entities/activities/embedded-activity-data.entity";

export const embeddedActivityDataEntityResolvers: Pick<GQLEmbeddedActivityDataResolvers, keyof EmbeddedActivityDataEntity> = {
    activityId: obj => obj.activityId.toString(),
    url: obj => obj.url,
    height: obj => obj.height,
}

export const embeddedActivityDataResolvers: GQLEmbeddedActivityDataResolvers = {
    ...embeddedActivityDataEntityResolvers,
}
