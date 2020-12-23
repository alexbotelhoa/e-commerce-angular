import { GQLQueryResolvers } from "../../../../resolvers-types";
import { ENROLLMENT_TABLE } from "../../../../entities/enrollment.entity";
import { LEVEL_CODE_TABLE } from "../../../../entities/level-code.entity";
import { CLASS_TABLE } from "../../../../entities/class.entity";

export const viewerEnrollmentLevelCodesQueryResolver: GQLQueryResolvers['viewerEnrollmentLevelCodes'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!params || !params.filters) {
        return [];
    }

    const query = context.database
        .distinct(`${LEVEL_CODE_TABLE}.*`)
        .from(ENROLLMENT_TABLE)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.id`, `${ENROLLMENT_TABLE}.levelCodeId`)
        .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)

    if (params.filters.userId) {
        query.andWhere(`${ENROLLMENT_TABLE}.userId`, '=', params.filters.userId);
    }

    if (params.filters?.last30days) {
        query.andWhere(`${CLASS_TABLE}.endDate`, '>=', context.database.raw('DATE_ADD(CURRENT_DATE(), INTERVAL - 30 DAY)'));
    }

    const entities = await query;
    return entities;
}
