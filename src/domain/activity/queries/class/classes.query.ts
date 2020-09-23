import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectClass } from "../../../../shared/repositories/class.repository";

export const classesQueryResolver: GQLQueryResolvers['classes'] = async (obj, { data }, context) => {
    const query = selectClass(context.database);
    if (data) {
        if (data.ids) {
            query.whereIn('id', data.ids);
        }
        if (data.carrerIds) {
            query.whereIn('carrerId', data.carrerIds);
        }
        if (data.institutionIds) {
            query.whereIn('institutionId', data.institutionIds);
        }
        if (data.periodIds) {
            query.whereIn('periodId', data.periodIds);
        }
        if (data.sessionIds) {
            query.whereIn('sessionId', data.sessionIds);
        }
    }
    return await query;
}
