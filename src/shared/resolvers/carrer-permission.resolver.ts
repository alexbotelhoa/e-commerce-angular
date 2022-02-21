

import { PermissionEntity } from "../../entities/permission.entity";
import { GQLCarrerPermissionResolvers } from "../../resolvers-types";

const CarrerPermissionEntityResolvers: Pick<GQLCarrerPermissionResolvers, keyof PermissionEntity> = {
    id: obj => obj.id,
    active: obj => obj.active,
    carrerId: obj => obj.carrerId,
    createdAt: obj => obj.createdAt && new Date(obj.createdAt).toISOString(),
    updatedAt: obj => obj.updatedAt && new Date(obj.updatedAt).toISOString(),
    carrer: obj => obj.carrer,
    name: obj => obj.name
}

export const carrerPermissionResolver: GQLCarrerPermissionResolvers = {
    ...CarrerPermissionEntityResolvers,
}
