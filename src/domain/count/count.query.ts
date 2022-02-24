import { GQLQueryResolvers } from "../../resolvers-types";
import { selectCount } from "../../shared/repositories/count.repository";

export const countQueryResolver: GQLQueryResolvers['count'] = async (obj, { data }, context) => {
    const query = selectCount(context.readonlyDatabase);
    if (data) {
        if (data.search) {
            query.where("id", "like", `%${data.search}%`)
            query.orWhere("name", "like", `%${data.search}%`)
        }
        if (data.ids && data.ids.length > 0) {
            query.whereIn('id', data.ids);
        }
    }
    return await query;
}
