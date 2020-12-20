import { GQLChallengeResolvers, GQLRegionalResolvers } from "../../resolvers-types";
import { ChallengeEntity } from "../../entities/challenge.entity";
import { RegionalEntity } from "../../entities/regional.entity";

export const regionalEntityResolvers: Pick<GQLRegionalResolvers, keyof RegionalEntity> = {
    id: obj => obj.id.toString(),
    description: obj => obj.description,
    name: obj => obj.name,
}


export const regionalResolvers: GQLRegionalResolvers = {
    ...regionalEntityResolvers,
}
