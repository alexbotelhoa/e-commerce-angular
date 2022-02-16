import { GQLRegionalResolvers } from "../../resolvers-types";
import { RegionalEntity } from "../../entities/regional.entity";

const regionalEntityResolvers: Pick<GQLRegionalResolvers, keyof RegionalEntity> = {
    id: obj => obj.id.toString(),
    description: obj => obj.description,
    name: obj => obj.name,
}

export const regionalResolvers: GQLRegionalResolvers = {
    ...regionalEntityResolvers,
}
