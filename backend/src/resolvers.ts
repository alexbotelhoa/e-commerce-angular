import { GQLResolvers } from "./resolvers-types";

import { mutationResolvers } from "./shared/resolvers/mutation.resolvers"
import { queryResolvers } from "./shared/resolvers/query.resolvers"

import { dateTimeScalarResolver } from "./shared/scalars/datetime.scalar";
import { simpleErrorResolvers } from "./shared/resolvers/simple-error.resolver";
import { userResolvers } from "./shared/resolvers/user.resolvers"
import { categoryResolvers } from "./shared/resolvers/category.resolvers";
import { productResolvers } from "./shared/resolvers/product.resolvers";
import { logResolver } from "./shared/resolvers/log.resolver";

export type InterfaceResolverKeys = 'GenericError';

export const resolvers: Omit<GQLResolvers, InterfaceResolverKeys> = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    DateTime: dateTimeScalarResolver,
    User: userResolvers,
    Category: categoryResolvers,
    Log: logResolver,
    Product: productResolvers,
    SimpleError: simpleErrorResolvers,
};
