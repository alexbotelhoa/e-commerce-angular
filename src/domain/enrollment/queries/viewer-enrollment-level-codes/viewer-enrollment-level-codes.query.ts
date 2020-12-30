import { GQLQueryResolvers } from "../../../../resolvers-types";
import { ENROLLMENT_TABLE } from "../../../../entities/enrollment.entity";
import { CLASS_TABLE } from "../../../../entities/class.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../../../entities/enrollment-class.entity";
import { LEVEL_CODE_TABLE } from "../../../../entities/level-code.entity";

export const viewerEnrollmentLevelCodesQueryResolver: GQLQueryResolvers['viewerEnrollmentLevelCodes'] = async (obj, params, context) => {

    const query = context.database
        .select(`${LEVEL_CODE_TABLE}.*`)
        .from(LEVEL_CODE_TABLE)

    if (params.filters?.last30days && params.filters.userId) {
        query.innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        query.innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.id`)
        query.innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${ENROLLMENT_CLASS_TABLE}.classId`)
        query.andWhere(`${ENROLLMENT_TABLE}.userId`, '=', params.filters.userId);
        query.andWhere(`${CLASS_TABLE}.endDate`, '>=', context.database.raw('DATE_ADD(CURRENT_DATE(), INTERVAL - 30 DAY)'));
    }
    else {
        if (params.filters?.userId) {
            query.innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
            query.innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.id`)
            query.innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${ENROLLMENT_CLASS_TABLE}.classId`)
            query.andWhere(`${ENROLLMENT_TABLE}.userId`, '=', params.filters.userId);
        }
        if (params.filters?.last30days) {
            query.innerJoin(CLASS_TABLE, `${CLASS_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
            query.andWhere(`${CLASS_TABLE}.endDate`, '>=', context.database.raw('DATE_ADD(CURRENT_DATE(), INTERVAL - 30 DAY)'));
        }
    }

    const entities = await query;
    return entities;
}
