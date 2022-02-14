import { GQLInterestResolvers } from "../../resolvers-types";
import { InterestEntity } from "../../entities/interest.entity";

const interestEntityResolvers: Pick<GQLInterestResolvers, keyof InterestEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
}

export const interestResolvers: GQLInterestResolvers = {
    ...interestEntityResolvers,
}
