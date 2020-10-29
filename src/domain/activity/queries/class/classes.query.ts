import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectClass } from "../../../../shared/repositories/class.repository";

export const classesQueryResolver: GQLQueryResolvers['classes'] = async (obj, { data }, context) => {
    const query = selectClass(context.readonlyDatabase);
    if (data) {
        if (data.ids && data.ids.length > 0) {
            query.whereIn('id', data.ids);
        }
        if (data.carrerIds && data.carrerIds.length > 0) {
            query.whereIn('carrerId', data.carrerIds);
        }
        if (data.institutionIds && data.institutionIds.length > 0) {
            query.whereIn('institutionId', data.institutionIds);
        }
        if (data.periodIds && data.periodIds.length > 0) {
            query.whereIn('periodId', data.periodIds);
        }
        if (data.sessionIds && data.sessionIds.length > 0) {
            query.whereIn('sessionId', data.sessionIds);
        }
    }
    return await query;
}
