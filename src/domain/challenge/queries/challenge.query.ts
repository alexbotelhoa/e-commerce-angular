import { GQLQueryResolvers } from "../../../resolvers-types";
import { getChallengeById } from "../../../shared/repositories/challenge.repository";

export const challengeQueryResolver: GQLQueryResolvers['challenge'] = (obj, { id }, context) => {
    return getChallengeById(context.database)(id);
}
