import { GQLHtmlActivityDataResolvers } from "../../../../../resolvers-types";
import { HtmlActivityDataEntity } from "../../../../../entities/activities/html-activity-data.entity";

export const htmlActivityDataEntityResolvers: Pick<GQLHtmlActivityDataResolvers, keyof HtmlActivityDataEntity> = {
    activityId: obj => obj.activityId.toString(),
    html: obj => obj.html,
}

export const htmlActivityDataResolvers: GQLHtmlActivityDataResolvers = {
    ...htmlActivityDataEntityResolvers,
}
