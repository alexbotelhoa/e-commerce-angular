import { format } from "date-fns";
import { GQLClassItemResolvers, GQLLevelCodeItemResolvers, GQLQueryResolvers, GQLTeacherClassesActivatedResolvers } from "../../../../resolvers-types";

export const teacherClassesActivatedQueryResolver: GQLQueryResolvers["teacherClassesActivated"] = async (obj, args, context) => {
    const user = context.currentUser;
    if (!user) {
        return [];
    }

    const endDate = new Date();
    const endDateFormated = format(endDate, 'yyyy-MM-dd');

    const result = await context.database.raw(`
        select distinct lc.code, cl.id, cl.name, lc.levelId
        from level_code lc
        inner join class cl on cl.levelCodeId = lc.id
        inner join teacher_class tc on cl.id=tc.classId
        where teacherId = ${user.id} and cl.endDate >= '${endDateFormated}'
        order by cl.name;  
    `);

    return result[0].map((item: any) => ({
        code: item.code,
        class: {
            id: item.id,
            name: item.name,
            levelCode: {
                levelId: item.levelId
            }
        }
    }));
}

export const teacherClassesActivatedResolvers: GQLTeacherClassesActivatedResolvers = {
    code: obj => obj.code || "",
    class: obj => obj.class || null,
}

export const classItemResolvers: GQLClassItemResolvers = {
    id: obj => obj.id || "",
    name: obj => obj.name || "",
    levelCode: obj => obj.levelCode || null,
}

export const levelCodeItemResolvers: GQLLevelCodeItemResolvers = {
    levelId: obj => obj.levelId || "",
}