import { GQLResolvers } from "../../../../../resolvers-types";
import { activityResolvers } from "../../activity.resolvers";
import { htmlActivityDataResolver } from "./html-activity-data.resolver";

export const htmlActivityResolvers: GQLResolvers['HtmlActivity'] = {
    ...activityResolvers,
    data: htmlActivityDataResolver,
}
