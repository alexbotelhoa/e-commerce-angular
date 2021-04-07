import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectChallenge } from "../../../../shared/repositories/challenge.repository";

export const activeChallengeQueryResolver: GQLQueryResolvers['activeChallenge'] =
    async (obj, params, context) => {
        let actualDate = new Date().toISOString();
        actualDate = actualDate.split('T')[0];

        console.log('actualDate ', actualDate);

        const challenge = await selectChallenge(context.database)
            .where('startAt', '<=', actualDate)
            .where('endAt', '>', actualDate)
            .where('active', '=', true)
            .orderBy('startAt', 'desc')
            .first();

        if (!challenge) {
            throw new Error('Unable to find an active challenge');
        }

        return challenge;
    }
