import { ActivityEntity } from "../../../../entities/activity.entity";
import { GQLDeleteActivityCommentSuccessResultResolvers } from "../../../../resolvers-types";
import { getActivityById } from "../../../../shared/repositories/activity.repository";

export interface DeleteActivityCommentSuccessResult {
    success: true;
    activityId: number;
}

export const DeleteActivityCommentSuccessResultResolvers: GQLDeleteActivityCommentSuccessResultResolvers = {
    activity: async (obj, params, context) => (await getActivityById(context.database)(obj.activityId))!,
    success: obj => obj.success,
}
