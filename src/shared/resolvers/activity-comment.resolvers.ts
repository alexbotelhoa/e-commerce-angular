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
    createdAt: obj => obj.createdAt,
}

const activityCommentRepliesSorter = createDataloaderMultiSort<ActivityCommentEntity, number>('parentId');

const activityCommentRepliesByIdLoader: DatabaseLoaderFactory<number, ActivityCommentEntity[], ActivityCommentEntity[]> = {
    id: 'activityCommentRepliesByIdLoader',
    batchFn: db => async (ids) => {
        const entities = await selectActivityComment(db).whereIn('parentId', ids);
        const result = activityCommentRepliesSorter(ids)(entities);
        return result;
    }
};

const activityCommentRepliesFieldResolver: GQLActivityCommentResolvers['replies'] = async (obj, params, context) => {
    return context.getDatabaseLoader(activityCommentRepliesByIdLoader, undefined).load(obj.id);
}

const activityCommentUserSorter = createDataloaderSingleSort<UserEntity, number, UserEntity>('id');

const activityCommentUserByIdLoader: DatabaseLoaderFactory<number, UserEntity, UserEntity> = {
    id: 'activityCommentUserByIdLoader',
    batchFn: db => async (ids) => {
        const entities = await selectUser(db).whereIn('id', ids);
        const result = activityCommentUserSorter(ids)(entities);
        return result;
    }
};

const activityCommentUserFieldResolver: GQLActivityCommentResolvers['user'] = async (obj, params, context) => {
    return context.getDatabaseLoader(activityCommentUserByIdLoader, undefined).load(obj.userId);
}

const activityCommentViewerCanDeleteResolver: GQLActivityCommentResolvers['viewerCanDelete'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return false;
    }
    if (user.id === obj.userId) {
        return true;
    }
    if (user.permissionMap.MANAGE_COMMENTS) {
        return true;
    }
    return false;
}

const activityCommentViewerCanEditResolver: GQLActivityCommentResolvers['viewerCanEdit'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return false;
    }
    if (user.id === obj.userId) {
        return true;
    }
    return false;
}




export const activityCommentResolvers: GQLActivityCommentResolvers = {
    ...activityCommentEntityResolvers,
    replies: activityCommentRepliesFieldResolver,
    user: activityCommentUserFieldResolver,
    viewerCanDelete: activityCommentViewerCanDeleteResolver,
    viewerCanEdit: activityCommentViewerCanEditResolver,
}
