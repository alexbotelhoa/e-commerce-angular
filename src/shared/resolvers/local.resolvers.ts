import { GQLChallengeResolvers, GQLLocalResolvers, GQLRegionalResolvers } from "../../resolvers-types";
import { ChallengeEntity } from "../../entities/challenge.entity";
import { RegionalEntity } from "../../entities/regional.entity";
import { LocalEntity } from "../../entities/local.entity";

export const localEntityResolvers: Pick<GQLLocalResolvers, keyof LocalEntity> = {
    id: obj => obj.id.toString(),
    description: obj => obj.description,
    name: obj => obj.name,
    campusId: obj => obj.campusId
}


export const localResolvers: GQLLocalResolvers = {
    ...localEntityResolvers,
}
