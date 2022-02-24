import { GQLNewsletter, GQLQueryResolvers } from "../../../resolvers-types";
import { getNewsletterById, selectNewsletter } from "../../../shared/repositories/newsletter.repository";

export const newsletterQueryResolver: GQLQueryResolvers['newsletter'] = async (obj, { id }, context) => {
    const valor: GQLNewsletter | null = await getNewsletterById(context.database)(id);
    return valor;
}

export const newslettersActiveQueryResolver: GQLQueryResolvers['newslettersActive'] = async (obj, args, context) => {
    const result = await selectNewsletter(context.database)
        .andWhere('active', true);

    return result;
}
