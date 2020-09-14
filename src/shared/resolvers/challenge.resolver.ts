import { GQLChallengeResolvers } from "../../resolvers-types";
import { ChallengeEntity } from "../../entities/challenge.entity";

export const challengeEntityResolvers: Pick<GQLChallengeResolvers, keyof ChallengeEntity> = {
    id: obj => obj.id.toString(),
    text: obj => obj.text,
    startAt: obj => obj.startAt,
}


export const challengeResolvers: GQLChallengeResolvers = {
    ...challengeEntityResolvers,
}