import { GQLSimpleErrorResolvers } from "../../resolvers-types";

export const simpleErrorResolvers: GQLSimpleErrorResolvers = {
    message: obj => obj.message,
}
