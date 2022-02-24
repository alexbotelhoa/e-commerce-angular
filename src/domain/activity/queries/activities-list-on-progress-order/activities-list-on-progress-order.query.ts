import { GQLQueryResolvers } from "../../../../resolvers-types";

export const activitiesListProgressQueryResolver: GQLQueryResolvers['activitiesListByProgressOrder'] = async (obj, params, context) => {
    const [results] = await context.readonlyDatabase.raw(`
    select 
    lt.id as partId,
    ca.id as activityId,
    ca.order as cycleOrder
    from level l 
    inner join level_theme lt on lt.levelId = l.id
    inner join theme t on t.id = lt.themeId
    right join cycle c on c.levelThemeId = lt.id
    inner join cycle_activity ca on ca.cycleId = c.id
    inner join activity a on a.id = ca.activityId
    where l.id = '${params.courseId}' 
    order by lt.order ASC, c.order ASC, ca.order ASC
    `)
    return results;
}
