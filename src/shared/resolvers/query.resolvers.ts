import { GQLResolvers } from "../../resolvers-types"
import { levelsQueryResolver } from "../../domain/activity/queries/levels/levels.query";
import { themesQueryResolver } from "../../domain/activity/queries/themes/themes.query";
import { themeQueryResolver } from "../../domain/activity/queries/theme/theme.query";
import { activitiesQuery } from "../../domain/activity/queries/activities/activities.query";
import { activityQuery } from "../../domain/activity/queries/activity/activity.query";
import { cyclesQueryResolver } from "../../domain/activity/queries/cycles/cycles.query"
import { cycleQuery } from "../../domain/activity/queries/cycle/cycle.query"

export const queryResolvers: GQLResolvers['Query'] = <GQLResolvers['Query']>{
    theme: themeQueryResolver,
    themes: themesQueryResolver,
    levels: levelsQueryResolver,
    activity: activityQuery,
    activities: activitiesQuery,
    cycle: cycleQuery,
    cycles: cyclesQueryResolver
}