import { GQLQueryResolvers } from "../../resolvers-types";
import { selectInterest } from "../../shared/repositories/interest.repository";

export const interestQueryResolver: GQLQueryResolvers['interest'] = async (obj, params, context) => {
    const page = params.filters.page ? Number(params.filters.page) : undefined;
    const perpage = params.filters.perpage ? Number(params.filters.perpage) : undefined
    const offset = perpage ? ((page ? Number(page) : 1) - 1) * Number(perpage) : 0
    return await selectInterest(context.database)
        .offset(offset)
        .limit(perpage ? perpage : 10)
}
