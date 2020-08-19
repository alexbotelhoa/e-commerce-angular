import { GQLMutationResolvers, GQLDeleteActivityCommentResultResolvers, GQLDeleteActivityCommentSuccessResult } from "../../../../resolvers-types";
import { SimpleError } from "../../../../shared/types/errors/simple-error.type";
import { getActivityCommentById, deleteActivityComment } from "../../../../shared/repositories/comment/activity-comment.repository";
import { getActivityById } from "../../../../shared/repositories/activity.repository";
import { ActivityTypeId } from "../../enums/activity-type.enum";
import { DeleteActivityCommentSuccessResult } from "./delete-activity-comment-success-result.type";

export const deleteActivityCommentMutationResolver: GQLMutationResolvers['deleteActivityComment'] =
    async (obj, { data }, context) => {
        const user = context.currentUser;
        if (!user) {
            const simpleError: SimpleError = {
                message: `You are not authenticated.`,
                type: 'SimpleError',
            }
            return simpleError;
        }
        const activityComment = await getActivityCommentById(context.database)(data.commentId);
        if (!activityComment) {
            const simpleError: SimpleError = {
                message: `Comment not found.`,
                type: 'SimpleError',
            }
            return simpleError;
        }

        // TODO Add additional security checks

        await deleteActivityComment(context.database)(builder => builder.where('id', data.commentId));

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const successResult: DeleteActivityCommentSuccessResult = {
            success: true,
            activityId: activityComment.activityId,
        };
        return successResult;
    };


export const deleteActivityCommentResultResolver: GQLDeleteActivityCommentResultResolvers = {
    __resolveType: (obj) => {
        if ('type' in obj) {
            return obj.type;
        }
        return 'DeleteActivityCommentSuccessResult';
    }
}
