import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectTeacherClass } from "../../../../shared/repositories/teacher-class.repository";

export const teacherClassesQueryResolver: GQLQueryResolvers['teacherClasses'] = async (obj, { data }, context) => {
    const query = selectTeacherClass(context.database);

    if (data.teacherIds && data.teacherIds.length > 0) {
        query.whereIn('teacherId', data.teacherIds);
    }

    return await query;
}
