import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getNewsletterById, insertNewsletter, updateNewsletter } from "../../../../shared/repositories/newsletter.repository";

export const createNewsletterMutationResolver: GQLMutationResolvers['createNewsletter'] = async (obj, { data }: { data: { name: string, linkUrl: string, imgSrc: string } }, { database: db }) => {
    const { name, linkUrl, imgSrc } = data;
    const insertedId = await db.transaction(async trx => {
        const id = await insertNewsletter(trx)({ name, linkUrl, imgSrc });
        return id;
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getNewsletterById(db)(insertedId))!;
}

export const updateNewsletterMutationResolver: GQLMutationResolvers['updateNewsletter'] = async (obj, { data }, context) => {
    const theme = await getNewsletterById(context.database);
    if (!theme) {
        throw new Error(`Newsletter with id ${data.id} was not found.`);
    }

    await context.database.transaction(async (trx) => {
        await updateNewsletter(trx)({
            name: data.name,
            linkUrl: data.linkUrl,
            imgSrc: data.imgSrc,
        })(builder => builder.andWhere('id', data.id));
    })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getNewsletterById(context.database)(data.id))!;
}

export const toggleNewsletterState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateNewsletter'] | GQLMutationResolvers['deactivateNewsletter'] =
    (data: Record<'active', boolean>) =>
        async(_, { id }, { database: db }) => {
    await updateNewsletter(db)(data)(builder => builder.andWhere('id', parseInt(id)))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getNewsletterById(db)(id))!;
}