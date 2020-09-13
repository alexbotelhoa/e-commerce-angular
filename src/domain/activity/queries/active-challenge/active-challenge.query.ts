import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectChallenge } from "../../../../shared/repositories/challenge.repository";

export const activeChallengeQueryResolver: GQLQueryResolvers['activeChallenge'] = async (obj, params, context) => {
    const challenge = await selectChallenge(context.database)
        .andWhere('startAt', '<=', new Date())
        .orderBy('startAt', 'desc')
        .first();
    if (!challenge) {
        throw new Error('Unable to find an active challenge');
    }
    return challenge;
}
