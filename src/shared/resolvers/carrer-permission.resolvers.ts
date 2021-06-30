

import { PermissionEntity } from "../../entities/permission.entity";
import { GQLCarrerPermissionResolvers } from "../../resolvers-types";

export const CarrerPermissionEntityResolvers: Pick<GQLCarrerPermissionResolvers, keyof PermissionEntity> = {
    id: obj => obj.id,
    active: obj => obj.active,
    carrerId: obj => obj.carrerId,
    createdAt: obj => obj.createdAt,
    updatedAt: obj => obj.updatedAt,
    carrer: obj => obj.carrer,
    name: obj => obj.name
}


export const carrerPermissionResolver: GQLCarrerPermissionResolvers = {
    ...CarrerPermissionEntityResolvers,
}
