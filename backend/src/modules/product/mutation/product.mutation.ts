import { GQLMutationResolvers } from "../../../resolvers-types";
import { getProductById, insertProduct, updateProduct } from "../../../shared/repositories/product.repository";

export const createProductMutationResolver: GQLMutationResolvers['createProduct'] = async (obj, { data }: { data: { name: string, price: number, categoryId: number } }, { database: db }) => {
    const { name, price, categoryId } = data;

    const insertedId = await db.transaction(async (trx) => {
        return await insertProduct(trx)({ name, price, categoryId });
    });

    return (await getProductById(db)(insertedId))!;
}

export const updateProductMutationResolver: GQLMutationResolvers['updateProduct'] = async (obj, { data }, context) => {
    const theme = await getProductById(context.database);
    if (!theme) {
        throw new Error(`Product with id ${data.id} was not found.`);
    }

    await context.database.transaction(async (trx) => {
        await updateProduct(trx)({
            name: data.name,
            price: data.price,
            categoryId: data.categoryId
        })(builder => builder.andWhere('id', data.id));
    })

    return (await getProductById(context.database)(data.id))!;
}
