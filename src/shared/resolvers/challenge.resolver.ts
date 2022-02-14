import { GQLChallengeResolvers } from "../../resolvers-types";
import { ChallengeEntity } from "../../entities/challenge.entity";

const challengeEntityResolvers: Pick<GQLChallengeResolvers, keyof ChallengeEntity> = {
    id: obj => obj.id.toString(),
    text: obj => obj.text,
    startAt: obj => obj.startAt,
    endAt: obj => obj.endAt,
    active: obj => obj.active,
}

export const challengeResolvers: GQLChallengeResolvers = {
    ...challengeEntityResolvers,
}
