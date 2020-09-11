import { GQLMutationResolvers } from "../../../../resolvers-types";
import { updateUser, getUserById } from "../../../../shared/repositories/user.repository";

export const finishOnboardMutationResolver: GQLMutationResolvers['finishOnboard'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        throw new Error('not authenticated');
    }
    await updateUser(context.database)({
        onboarded: true
    })(builder => builder.andWhere('id', user.id));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getUserById(context.database)(user.id))!;
}
