import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectTheme } from "../../../shared/repositories/theme.repository";

export const themesQueryResolver: GQLQueryResolvers['themes'] = (obj, params, context) => {
    return selectTheme(context.database)(builder => builder.andWhere('active', true));
}
