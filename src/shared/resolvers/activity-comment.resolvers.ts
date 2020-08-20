import { GQLActivityCommentResolvers } from "../../resolvers-types";
import { ActivityCommentEntity } from "../../entities/comments/activity-comment.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { selectActivityComment } from "../repositories/comment/activity-comment.repository";
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";
import { selectUser } from "../repositories/user.repository";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";
import { UserEntity } from "../../entities/user.entity";

export const activityCommentEntityResolvers: Pick<GQLActivityCommentResolvers, keyof ActivityCommentEntity> = {
    id: obj => obj.id.toString(10),
    activityId: obj => obj.activityId.toString(10),
    classId: obj => obj.classId.toString(10),
    text: obj => obj.text,
    parentId: obj => obj.parentId ? obj.parentId.toString(10) : null,
    userId: obj => obj.userId.toString(10),
}

const activityCommentRepliesSorter = createDataloaderMultiSort<ActivityCommentEntity, number>('parentId');

const activityCommentRepliesByIdLoader: DatabaseLoaderFactory<number, ActivityCommentEntity[], ActivityCommentEntity[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectActivityComment(db).whereIn('parentId', ids);
        const result = activityCommentRepliesSorter(ids)(entities);
        return result;
    }
});

const activityCommentRepliesFieldResolver: GQLActivityCommentResolvers['replies'] = async (obj, params, context) => {
    return context.getDatabaseLoader(activityCommentRepliesByIdLoader).load(obj.id);
}

const activityCommentUserSorter = createDataloaderSingleSort<UserEntity, number, UserEntity>('id');

const activityCommentUserByIdLoader: DatabaseLoaderFactory<number, UserEntity, UserEntity> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectUser(db).whereIn('id', ids);
        const result = activityCommentUserSorter(ids)(entities);
        return result;
    }
});

const activityCommentUserFieldResolver: GQLActivityCommentResolvers['user'] = async (obj, params, context) => {
    return context.getDatabaseLoader(activityCommentUserByIdLoader).load(obj.userId);
}



export const activityCommentResolvers: GQLActivityCommentResolvers = {
    ...activityCommentEntityResolvers,
    replies: activityCommentRepliesFieldResolver,
    user: activityCommentUserFieldResolver,
}
