import { GQLLocalResolvers } from "../../resolvers-types";
import { LocalEntity } from "../../entities/local.entity";

const localEntityResolvers: Pick<GQLLocalResolvers, keyof LocalEntity> = {
    id: obj => obj.id.toString(),
    description: obj => obj.description,
    name: obj => obj.name,
    campusId: obj => obj.campusId
}

export const localResolvers: GQLLocalResolvers = {
    ...localEntityResolvers,
}
