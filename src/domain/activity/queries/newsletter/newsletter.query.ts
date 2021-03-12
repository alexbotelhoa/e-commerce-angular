import { GQLNewsletter, GQLQueryResolvers } from "../../../../resolvers-types";
import { getNewsletterById } from "../../../../shared/repositories/newsletter.repository";

export const newsletterQueryResolver: GQLQueryResolvers['newsletter'] = async (obj, { id }, context) => {
    const valor: GQLNewsletter | null = await getNewsletterById(context.database)(id);
    return valor;
}