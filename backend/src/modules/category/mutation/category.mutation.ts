import { GQLMutationResolvers } from "../../../resolvers-types";
import {
    getCategoryById,
    insertCategory,
    updateCategory,
} from "../../../shared/repositories/category.repository";

export const createCategoryMutationResolver: GQLMutationResolvers["createCategory"] =
    async (obj, { data }: { data: { name: string } }, { database: db }) => {
        const { name } = data;

        const insertedId = await db.transaction(async (trx) => {
            return await insertCategory(trx)({ name });
        });

        return (await getCategoryById(db)(insertedId))!;
    };

export const updateCategoryMutationResolver: GQLMutationResolvers["updateCategory"] =
    async (obj, { data }, context) => {
        const theme = await getCategoryById(context.database);
        if (!theme) {
            throw new Error(`Category with id ${data.id} was not found.`);
        }

        await context.database.transaction(async (trx) => {
            await updateCategory(trx)({
                name: data.name,
            })((builder) => builder.andWhere("id", data.id));
        });

        return (await getCategoryById(context.database)(data.id))!;
    };
