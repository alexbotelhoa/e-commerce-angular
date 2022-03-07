import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChallenge } from "../../../shared/repositories/challenge.repository";

export const challengesQueryResolver: GQLQueryResolvers['challenges'] = async (obj, params, context) => {
    return await selectChallenge(context.database);
}
