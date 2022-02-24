import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectNewsletter } from "../../../shared/repositories/newsletter.repository";

export const newslettersQueryResolver: GQLQueryResolvers['newsletters'] = async (obj, params, context) => {
    return await selectNewsletter(context.database);
}
