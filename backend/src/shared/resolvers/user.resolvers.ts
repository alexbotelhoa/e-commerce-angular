import { UserEntity } from "../../entities/user.entity";
import { GQLUserResolvers } from "../../resolvers-types";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    email: obj => obj.email,
    createdAt: obj => obj.createdAt,
    updatedAt: obj => obj.updatedAt,
}

export const userResolvers: GQLUserResolvers = {
    ...userEntityResolvers
}
