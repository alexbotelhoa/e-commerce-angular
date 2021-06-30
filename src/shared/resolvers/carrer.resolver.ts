

import { CarrerEntity } from "../../entities/carrer.entity";
import { GQLCarrerResolvers } from "../../resolvers-types";

export const CarrerEntityResolvers: Pick<GQLCarrerResolvers, keyof CarrerEntity> = {
    id: obj => obj.id,
    active: obj => obj.active,
    carrerId: obj => obj.carrerId,
    createdAt: obj => obj.createdAt,
    updatedAt: obj => obj.updatedAt,

}


export const carrerResolver: GQLCarrerResolvers = {
    ...CarrerEntityResolvers,
}
