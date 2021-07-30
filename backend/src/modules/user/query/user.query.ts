import { GQLQueryResolvers } from "../../../resolvers-types";
import { getUserById, selectUser } from "../../../shared/repositories/user.repository";

export const userAllQueryResolver: GQLQueryResolvers['userAll'] = (obj, params, context) => {
    return selectUser(context.database);
}

export const userByIdQueryResolver: GQLQueryResolvers['userById'] = (obj, params, context) => {
    return getUserById(context.database)(params.id);
}

export const userByFieldQueryResolver: GQLQueryResolvers['userByField'] = (obj, { fields }: { fields: { id: any } }, context) => {
    return getUserById(context.database)(fields.id);
}
