import { GQLPermissionResolvers } from "../../../resolvers-types";


export const permissionResolvers: GQLPermissionResolvers = {
    id: obj => obj.id,
    name: obj => obj.name,
    description: obj => obj.description,
}
