import { GQLQueryResolvers } from "../../../resolvers-types";
import { getServiceNowLink } from "../services/service-now.service";
import { getUserById } from '../../../shared/repositories/user.repository';

export const getServiceNowUrlQueryResolver: GQLQueryResolvers['getServiceNow'] = async (obj, params, context) => {
    const currentUser = context.currentUser;
    if (currentUser?.id) {
        const user = await getUserById(context.database)(currentUser.id);
        if (user) {
            return getServiceNowLink(currentUser.id, user.isAdult, context.logger);
        }
    }
    throw Error("No student found.")
}
