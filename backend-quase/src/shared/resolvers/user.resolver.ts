import { GQLUserResolvers } from "../../resolvers-types"
import { UserEntity } from "../../entities/user.entity";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    email: obj => obj.email,
    createdAt: obj => obj.createdAt,
}

export const userResolver: GQLUserResolvers = {
    ...userEntityResolvers,
}