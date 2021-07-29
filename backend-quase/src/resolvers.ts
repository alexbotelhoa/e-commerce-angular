import { GQLResolvers } from "./resolvers-types";

import { queryResolvers } from "./shared/resolvers/query.resolvers";
import { mutationResolvers } from "./shared/resolvers/mutation.resolvers";

import { userResolver } from "./shared/resolvers/user.resolver";
import { logResolver } from "./shared/resolvers/log.resolver";

export const resolvers: GQLResolvers = {
    Query: queryResolvers,
    // Mutation: mutationResolvers,
    User: userResolver,
    Log: logResolver,
}
