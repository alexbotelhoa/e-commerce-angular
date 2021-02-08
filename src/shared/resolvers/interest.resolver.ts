import { GQLInterestResolvers } from "../../resolvers-types";
import { InterestEntity } from "../../entities/interest.entity";

export const interestEntityResolvers: Pick<GQLInterestResolvers, keyof InterestEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
}


export const regionalResolvers: GQLInterestResolvers = {
    ...interestEntityResolvers,
}
