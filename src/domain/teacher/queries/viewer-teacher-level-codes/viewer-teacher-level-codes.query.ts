import { CLASS_TABLE } from "../../../../entities/class.entity";
import { GQLQueryResolvers } from "../../../../resolvers-types";
import { LEVEL_CODE_TABLE } from "../../../../entities/level-code.entity";
import { TEACHER_CLASS_TABLE } from "../../../../entities/teacher-class.entity";

export const viewerTeacherLevelCodesQueryResolver: GQLQueryResolvers['viewerTeacherLevelCodes'] = async (obj, { filters }, context) => {
    const user = context.currentUser;
    if (!user) {
        return [];
    }
    const query = context.database
        .distinct(`${LEVEL_CODE_TABLE}.*`)
        .from(LEVEL_CODE_TABLE)
        .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        .innerJoin(TEACHER_CLASS_TABLE, `${TEACHER_CLASS_TABLE}.classId`, `${CLASS_TABLE}.id`)
        .andWhere('teacherId', user.id)

    if (filters?.classActive) {
        query.andWhereRaw(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29`)
    } else {
        query.andWhereRaw(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) > 29`)
    }
        query.orderBy('code', 'ASC');

    return await query;
}
