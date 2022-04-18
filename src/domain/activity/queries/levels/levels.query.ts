import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectLevel } from "../../../../shared/repositories/level.repository";

export const levelsQueryResolver: GQLQueryResolvers['levels'] = (obj, { data }, context) => {
    const name = data?.name;
    const query = selectLevel(context.database);
    if (name) {
        query.where('name', 'like', `%${name}%`)
    }
    return query;
}
