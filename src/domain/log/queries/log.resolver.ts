import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectLog } from "../../../shared/repositories/log.repository";

export const logQueryResolver: GQLQueryResolvers['logs'] = async (obj, { data }, context) => {
    const query = selectLog(context.readonlyDatabase);
    const perPage =  data?.perPage && parseFloat(data.perPage) || 10;
    const offset = perPage ? ((data?.page ? Number(data?.page) : 1) - 1) * Number(perPage) : 0
    const orderBy =  data?.orderBy === 'ASC' ? 'ASC' : 'DESC';

    if (data) {
        if (data.ids && data.ids.length > 0) {
            query.whereIn('id', data.ids);
        }
        if (data.userId) {
            query.where("body", "like", `%${data.userId}%`)
        }
        if (data.search) {
            query.where("body", "like", `%${data.search}%`)
        }
        query.limit(perPage)
        query.offset(offset);
    }
    query.orderBy('createdAt', orderBy);

    return await query;
}
