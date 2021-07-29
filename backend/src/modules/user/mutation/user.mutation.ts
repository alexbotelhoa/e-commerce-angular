import { GQLMutationResolvers } from "../../../resolvers-types";
import { getUserById, insertUser, updateUser } from "../../../shared/repositories/user.repository";

export const createUserMutationResolver: GQLMutationResolvers['createUser'] = async (obj, { data }: { data: { name: string, email: string } }, { database: db }) => {
    const { name, email } = data;

    const insertedId = await db.transaction(async (trx) => {
        return await insertUser(trx)({ name, email });
    });

    return (await getUserById(db)(insertedId))!;
}

export const updateUserMutationResolver: GQLMutationResolvers['updateUser'] = async (obj, { data }, context) => {
    const theme = await getUserById(context.database);
    if (!theme) {
        throw new Error(`User with id ${data.id} was not found.`);
    }

    await context.database.transaction(async (trx) => {
        await updateUser(trx)({
            name: data.name,
            email: data.email,
        })(builder => builder.andWhere('id', data.id));
    })

    return (await getUserById(context.database)(data.id))!;
}
