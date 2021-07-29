import { GQLResolvers } from "../../resolvers-types"

import { userQueryResolver } from "../../domain/queries/users/user.query"


export const queryResolvers: GQLResolvers['Query'] = {
    users: userQueryResolver
}
