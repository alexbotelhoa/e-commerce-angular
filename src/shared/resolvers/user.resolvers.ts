import { GQLResolvers, GQLUserResolvers } from "../../resolvers-types"
import { UserEntity } from "../../entities/user.entity";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    email: obj => obj.email,
    name: obj => obj.name,
}

export const userResolvers: GQLResolvers['User'] = <GQLResolvers['User']>{
    ...userEntityResolvers
}