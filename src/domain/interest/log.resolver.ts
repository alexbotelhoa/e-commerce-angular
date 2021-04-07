import { GQLQueryResolvers } from "../../resolvers-types";
import { selectLog } from "../../shared/repositories/log.repository";

export const logQueryResolver: GQLQueryResolvers['logs'] = async (obj, { data }, context) => {
    const query = selectLog(context.readonlyDatabase);
    if (data) {
        if (data.search) {
            query.where("key", "like", `%${data.search}%`)
            query.orWhere("body", "like", `%${data.search}%`)
        }
        if (data.ids && data.ids.length > 0) {
            query.whereIn('id', data.ids);
        }
    }
    return await query;
}
