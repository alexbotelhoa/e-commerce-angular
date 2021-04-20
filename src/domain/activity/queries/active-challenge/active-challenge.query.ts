import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectChallenge } from "../../../../shared/repositories/challenge.repository";

export const activeChallengeQueryResolver: GQLQueryResolvers['activeChallenge'] =
    async (obj, params, context) => {
        const actualDate = new Date().toISOString().split('T')[0];

        const challenge = await selectChallenge(context.database)
            .where('startAt', '<=', actualDate)
            .where('endAt', '>', actualDate)
            .where('active', '=', true)
            .orderBy('startAt', 'desc')
            .first();

        if (!challenge) {
            return null;
        }

        return challenge;
    }
