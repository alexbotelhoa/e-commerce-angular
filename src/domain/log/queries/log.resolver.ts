import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectLog } from "../../../shared/repositories/log.repository";

export const logQueryResolver: GQLQueryResolvers['logs'] = async (obj, { data }, context) => {
    const query = selectLog(context.readonlyDatabase);
    const perPage =  data?.perPage && parseFloat(data.perPage) || 10;
    const offset = perPage ? ((data?.page ? Number(data?.page) : 1) - 1) * Number(perPage) : 0
    const orderBy =  data?.orderBy === 'ASC' ? 'ASC' : 'DESC';
    if (data) {
        if (data.search) {
            query.where("key", "like", `%${data.search}%`)
            query.orWhere("body", "like", `%${data.search}%`)
        }
        if (data.ids && data.ids.length > 0) {
            query.whereIn('id', data.ids);
        }
        query.limit(perPage)
        .offset(offset);
    }
    query.orderBy('createdAt', orderBy);
    return await query;
}
