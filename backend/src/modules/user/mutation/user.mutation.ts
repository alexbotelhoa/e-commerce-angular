import { GQLMutationResolvers } from "../../../resolvers-types";
import {
    getUserById,
    insertUser,
    updateUser,
    deleteUser,
} from "../../../shared/repositories/user.repository";

export type User = {
    name: string
    email: string
}

export const createUserMutationResolver: GQLMutationResolvers['createUser'] = async (obj, { data }: { data: User }, { database: db }) => {
    const { name, email } = data;

    const insertedId = await db.transaction(async (trx) => {
        return await insertUser(trx)({ name, email });
    });

    return (await getUserById(db)(insertedId))!;
}

export const updateUserMutationResolver: GQLMutationResolvers['updateUser'] = async (obj, { data }, context) => {
    const query = await getUserById(context.database);
    if (!query) {
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

export const deleteUserMutationResolver: GQLMutationResolvers['deleteUser'] = async (obj, data, context) => {
    const query = await getUserById(context.database)(data.id);
    if (!query) {
        throw new Error(`User with id ${data.id} was not found.`);
    }

    await context.database.transaction(async (trx) => {
        await deleteUser(trx)((builder) => builder.andWhere("id", data.id));
    });

    return true;
}
