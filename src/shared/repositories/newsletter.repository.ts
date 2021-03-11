import { NewsletterEntity, NEWSLETTER_TABLE } from "../../entities/newsletter.entity";
import { createRepository } from "../services/repository.service";

export const {
    getById: getNewsletterById,
    getManyByIds: getNewslettersByIds,
    select: selectNewsletter,
    insert: insertNewsletter,
    update: updateNewsletter,
    delete: deleteNewsletter,
    deleteAll: deleteAllNewsletters,
    count: countNewsletters,
} = createRepository<NewsletterEntity>(NEWSLETTER_TABLE, 'id');
