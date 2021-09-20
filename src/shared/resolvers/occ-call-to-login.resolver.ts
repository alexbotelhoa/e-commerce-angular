import { GQLOccResultResolvers } from "../../resolvers-types";

export const occLoginResolvers: GQLOccResultResolvers = {
    tokenSaml: obj => obj.tokenSaml,
    urlSubmit: obj => obj.urlSubmit,
}
