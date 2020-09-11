import { GQLViewerChangeAvatarMutationErrorResolvers, GQLViewerChangeAvatarMutationResultResolvers } from "../../../../resolvers-types";

export const viewerChangeAvatarMutationErrorResolvers: GQLViewerChangeAvatarMutationErrorResolvers = {
    message: (obj) => obj.message,
}

export const viewerChangeAvatarMutationResultResolvers: GQLViewerChangeAvatarMutationResultResolvers = {
    __resolveType: (parent) => {
        if ('message' in parent) {
            return 'ViewerChangeAvatarMutationError';
        }
        return 'User';
    }
}
