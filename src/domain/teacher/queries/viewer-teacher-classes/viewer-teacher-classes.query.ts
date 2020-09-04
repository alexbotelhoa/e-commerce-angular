import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectTeacherClass } from "../../../../shared/repositories/teacher-class.repository";

export const viewerTeacherClassesQueryResolver: GQLQueryResolvers['viewerTeacherClasses'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return [];
    }
    return await selectTeacherClass(context.database)
        .andWhere('teacherId', user.id);
}
