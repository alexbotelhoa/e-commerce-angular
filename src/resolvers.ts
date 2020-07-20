import { GQLResolvers, GQLUserResolvers } from "./resolvers-types";
import { UserEntity } from "./entities/user.entity";
import { levelsQueryResolver } from "./domain/activity/queries/levels.query";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    email: obj => obj.email,
    name: obj => obj.name,
}

export const resolvers: GQLResolvers = {
    Query: {
        levels: levelsQueryResolver,
    },
    User: userEntityResolvers,
}



