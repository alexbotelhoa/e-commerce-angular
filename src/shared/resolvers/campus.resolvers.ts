import { GQLCampusResolvers } from "../../resolvers-types";
import { CampusEntity } from "../../entities/campus.entity";

export const campusEntityResolvers: Pick<GQLCampusResolvers, keyof CampusEntity> = {
    id: obj => obj.id.toString(),
    description: obj => obj.description,
    name: obj => obj.name,
    regionalId: obj => obj.regionalId
}


export const campusResolvers: GQLCampusResolvers = {
    ...campusEntityResolvers,
}
