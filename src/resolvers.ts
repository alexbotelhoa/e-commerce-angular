import { GQLResolvers, GQLUserResolvers } from "./resolvers-types";
import { UserEntity } from "./entities/user.entity";
import { levelsQueryResolver } from "./domain/activity/queries/levels.query";
import { themesQueryResolver } from "./domain/activity/queries/themes.query";
import { createThemeMutationResolver, activateThemeMutationResolver, deactivateThemeMutationResolver } from "./domain/activity/mutations/theme.mutation";
import { themeQueryResolver } from "./domain/activity/queries/theme.query";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    email: obj => obj.email,
    name: obj => obj.name,
}

export const resolvers: GQLResolvers = {
    Query: {
        theme: themeQueryResolver,
        levels: levelsQueryResolver,
        themes: themesQueryResolver,
    },
    Mutation: {
        createTheme: createThemeMutationResolver,
        activateTheme: activateThemeMutationResolver,
        deactivateTheme: deactivateThemeMutationResolver
    },
    User: userEntityResolvers,
}



