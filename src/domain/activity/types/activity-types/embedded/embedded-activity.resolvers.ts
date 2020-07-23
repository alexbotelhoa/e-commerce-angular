import { GQLResolvers } from "../../../../../resolvers-types";
import { activityResolvers } from "../../activity.resolvers";
import { embeddedActivityDataResolver } from "./embedded-activity-data.resolver";

export const embeddedActivityResolvers: GQLResolvers['EmbeddedActivity'] = {
    ...activityResolvers,
    data: embeddedActivityDataResolver,
}
