import { GQLMutationResolvers, GQLCreateCommentOnActivityResultResolvers } from "../../../../resolvers-types";
import { SimpleError } from "../../../../shared/types/errors/simple-error.type";
import { insertActivityComment, getActivityCommentById } from "../../../../shared/repositories/comment/activity-comment.repository";

export const createCommentOnActivityMutationResolver: GQLMutationResolvers['createCommentOnActivity'] =
    async (obj, { data }, context) => {
        const user = context.currentUser;
        if (!user) {
            const simpleError: SimpleError = {
                message: `You are not authenticated.`,
                type: 'SimpleError',
            }
            return simpleError;
        }

        // TODO Add additional security checks

        const commentId = await context.database.transaction(async trx => {

            const insertedCommentId = await insertActivityComment(trx)({
                activityId: parseInt(data.activityId, 10),
                classId: parseInt(data.classId, 10),
                parentId: data.parentCommentId
                    ? parseInt(data.parentCommentId, 10)
                    : null,
                text: data.comment,
                userId: user.id,
            });

            return insertedCommentId;
        });

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (await getActivityCommentById(context.database)(commentId))!;
    };

export const createCommentOnActivityResultResolver: GQLCreateCommentOnActivityResultResolvers = {
    __resolveType: (obj) => {
        if ('type' in obj) {
            return obj.type;
        }
        return 'ActivityComment';
    }
}
