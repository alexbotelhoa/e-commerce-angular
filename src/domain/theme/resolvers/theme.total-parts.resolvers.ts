import { GQLQueryResolvers, GQLThemeTotalResolvers } from "../../../resolvers-types";

export const themeTotalQueryResolver: GQLQueryResolvers["themeTotal"] = async (obj, args, context) => {
    const result = await context.database.raw(`
        select 
            t.name,
            sum(case when at.completed = 1 then 1 else 0 end) as totalCompleted,
            count(1) as total
        from class cl
        inner join activity_timer at on cl.id = at.classId
        inner join level_code lc on cl.levelCodeId = lc.id 
        inner join level l on lc.levelId = l.id
        inner join level_theme lt on lt.levelId = l.id
        inner join theme t on lt.themeId = t.id
        where cl.id = ? 
        group by t.name;    
    `, [args.classId]);

    return result[0];
}

export const themeTotalResolvers: GQLThemeTotalResolvers = {
    name: obj => obj.name || "",
    total: obj => obj.total || 0,
    totalCompleted: obj => obj.totalCompleted || 0,
}
