import { GQLQueryResolvers } from "../../../resolvers-types";
import { getUserById } from "../../../shared/repositories/user.repository";

export const userQueryResolver: GQLQueryResolvers['user'] = (obj, { filters }: { filters: { id: any } }, context) => {
    return getUserById(context.database)(filters.id);
}
