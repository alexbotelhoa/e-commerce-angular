import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectLevelCode } from "../../../../shared/repositories/level-code.repository";

export const levelCodesQueryResolver: GQLQueryResolvers['levelCodes'] = (obj, params, context) => {
    return selectLevelCode(context.database);
}
