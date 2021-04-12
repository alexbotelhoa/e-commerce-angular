import { GQLQueryResolvers } from "../../../resolvers-types";
import { getServiceNowLink } from "../services/service-now.service";

export const getServiceNowUrlQueryResolver: GQLQueryResolvers['getServiceNow'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (user?.id) {
        return getServiceNowLink(user.id, context.logger);
    }
    throw Error("No student found.")
}
