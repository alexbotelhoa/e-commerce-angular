import { GQLQueryResolvers } from "../../../../resolvers-types";
import { LEVEL_CODE_TABLE } from "../../../../entities/level-code.entity";
import { CLASS_TABLE } from "../../../../entities/class.entity";
import { TEACHER_CLASS_TABLE } from "../../../../entities/teacher-class.entity";

export const viewerTeacherLevelCodesQueryResolver: GQLQueryResolvers['viewerTeacherLevelCodes'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        return [];
    }
    const query = context.database
        .distinct(`${LEVEL_CODE_TABLE}.*`)
        .from(LEVEL_CODE_TABLE)
        .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        .innerJoin(TEACHER_CLASS_TABLE, `${TEACHER_CLASS_TABLE}.classId`, `${CLASS_TABLE}.id`)
        .andWhere('teacherId', user.id);

    if (params.filters?.active) {
        query.andWhere(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate)`, '<', '30');
    }

    const entities = await query;
    return entities;
}
