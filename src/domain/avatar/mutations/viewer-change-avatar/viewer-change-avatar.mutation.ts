import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getAvatarById } from "../../../../shared/repositories/avatar.repository";
import { updateUser, getUserById } from "../../../../shared/repositories/user.repository";

export const viewerChangeAvatarMutationResolver: GQLMutationResolvers['viewerChangeAvatar'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return {
            message: 'Not logged in',
        }
    }
    const avatar = await getAvatarById(context.database)(params.data.avatarId);
    if (!avatar) {
        return {
            message: 'Avatar not found',
        };
    }
    await updateUser(context.database)({
        avatarId: parseInt(params.data.avatarId, 10),
    })(builder => builder.andWhere('id', user.id));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getUserById(context.database)(user.id))!;
}
