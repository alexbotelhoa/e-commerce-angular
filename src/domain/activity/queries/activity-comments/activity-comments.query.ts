import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectActivityComment } from "../../../../shared/repositories/comment/activity-comment.repository";

export const activityCommentsQueryResolver: GQLQueryResolvers['activityComments'] =
    async (obj, { data }, context) => {
        const user = context.currentUser;
        if (!user) {
            return [];
        }
        const mainQuery = selectActivityComment(context.database)
            .andWhere('activityId', data.activityId)
            // we only get top-level comments
            .andWhere('parentId', null);

        const classIds = data.classIds;
        if (classIds && classIds.length > 0) {
            mainQuery
                .andWhere(builder => {
                    return builder.whereIn('classId', classIds)
                        // also listing all comments from the user, regardless of classes
                        .orWhere('userId', user.id);
                });
        }

        return await mainQuery;
    }
