import { NewsletterEntity } from "../../entities/newsletter.entity";
import { GQLNewsletterResolvers } from "../../resolvers-types";

export const newsletterEntityResolvers: Pick<GQLNewsletterResolvers, keyof NewsletterEntity> = {
    id: obj => obj.id,
    name: obj => obj.name,
    linkUrl: obj => obj.linkUrl,
    active: obj => obj.active,
}


export const newsletterResolvers: GQLNewsletterResolvers = {
    ...newsletterEntityResolvers,
}
