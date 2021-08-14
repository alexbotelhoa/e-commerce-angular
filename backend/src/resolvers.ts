import { GQLResolvers } from "./resolvers-types";
import { logResolver } from "./shared/resolvers/log.resolver";
import { userResolvers } from "./shared/resolvers/user.resolvers";
import { queryResolvers } from "./shared/resolvers/query.resolvers";
import { productResolvers } from "./shared/resolvers/product.resolvers";
import { categoryResolvers } from "./shared/resolvers/category.resolvers";
import { mutationResolvers } from "./shared/resolvers/mutation.resolvers";
import { dateTimeScalarResolver } from "./shared/scalars/datetime.scalar";
import { simpleErrorResolvers } from "./shared/resolvers/simple-error.resolver";

export type InterfaceResolverKeys = 'GenericError';

export const resolvers: Omit<GQLResolvers, InterfaceResolverKeys> = {
    Log: logResolver,
    User: userResolvers,
    Query: queryResolvers,
    Product: productResolvers,
    Category: categoryResolvers,
    Mutation: mutationResolvers,
    DateTime: dateTimeScalarResolver,
    SimpleError: simpleErrorResolvers,
};
