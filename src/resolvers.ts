import { GQLResolvers, GQLUserResolvers, ActivityTypeId } from "./resolvers-types";
import { UserEntity } from "./entities/user.entity";
import { levelsQueryResolver } from "./domain/activity/queries/levels.query";
import { themesQueryResolver } from "./domain/activity/queries/themes.query";
import { createThemeMutationResolver, activateThemeMutationResolver, deactivateThemeMutationResolver } from "./domain/activity/mutations/theme.mutation";
import { themeQueryResolver } from "./domain/activity/queries/theme.query";
import { activitiesQuery } from "./domain/activity/queries/activities/activities.query";
import { activityUnionResolvers } from "./domain/activity/types/activity.union";
import { embeddedActivityResolvers } from "./domain/activity/types/activity-types/embedded/embedded-activity.resolvers";
import { htmlActivityResolvers } from "./domain/activity/types/activity-types/html/html-activity.resolvers";
import { activityQuery } from "./domain/activity/queries/activity/activity.query";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    email: obj => obj.email,
    name: obj => obj.name,

}

export const resolvers: GQLResolvers = <GQLResolvers>{
    Query: {
        theme: themeQueryResolver,
        levels: levelsQueryResolver,
        activity: activityQuery,
        activities: activitiesQuery,
        themes: themesQueryResolver,
    },
    Mutation: {
        createTheme: createThemeMutationResolver,
        activateTheme: activateThemeMutationResolver,
        deactivateTheme: deactivateThemeMutationResolver
    },
    User: {
        ...userEntityResolvers,
    },
    ActivityUnion: activityUnionResolvers,
    ActivityTypeId: ActivityTypeId,
    EmbeddedActivity: embeddedActivityResolvers,
    HtmlActivity: htmlActivityResolvers,
};



