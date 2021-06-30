

import { CarrerEntity } from "../../entities/carrer.entity";
import { GQLCarrerResolvers } from "../../resolvers-types";
import { selectPermission } from "../repositories/carrer-permission-repository";

export const CarrerEntityResolvers: Pick<GQLCarrerResolvers, keyof CarrerEntity> = {
    id: obj => obj.id,
    active: obj => obj.active,
    carrerId: obj => obj.carrerId,
    createdAt: obj => obj.createdAt && new Date(obj.createdAt).toISOString(),
    updatedAt: obj => obj.updatedAt && new Date(obj.updatedAt).toISOString(),

}


export const carrerResolver: GQLCarrerResolvers = {
    ...CarrerEntityResolvers,
    permissions: async (obj, params, context) => await selectPermission(context.database).where("carrerId", obj.carrerId),
}
