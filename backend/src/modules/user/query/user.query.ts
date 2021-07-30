import { GQLQueryResolvers } from "../../../resolvers-types";
import { getUserById, selectUser } from "../../../shared/repositories/user.repository";

export const userAllQueryResolver: GQLQueryResolvers['userAll'] = (obj, params, context) => {
    return selectUser(context.database);
}

export const userIdQueryResolver: GQLQueryResolvers['userId'] = (obj, { filters }: { filters: { id: any } }, context) => {
    return getUserById(context.database)(filters.id);
}
