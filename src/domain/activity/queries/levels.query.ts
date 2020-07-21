import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectLevel } from "../../../shared/repositories/level.repository";

export const levelsQueryResolver: GQLQueryResolvers['levels'] = (obj, params, context) => {
    return selectLevel(context.database);
}
