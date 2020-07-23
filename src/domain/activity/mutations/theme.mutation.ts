import { GQLMutationResolvers } from "../../../resolvers-types";
import { getThemeById, insertTheme, updateTheme } from "../../../shared/repositories/theme.repository";

export const createThemeMutationResolver: GQLMutationResolvers['createTheme'] = async (obj, { data }, context) => {
    return getThemeById(context.database)(await insertTheme(context.database)(data));
}

export const activateThemeMutationResolver: GQLMutationResolvers['activateTheme'] = async (obj, { id }, context) => {
    return getThemeById(context.database)(await updateTheme(context.database)({ active: true })(builder => builder.andWhere('id', id)));
}

export const deactivateThemeMutationResolver: GQLMutationResolvers['deactivateTheme'] = async (obj, { id }, context) => {
    return getThemeById(context.database)(await updateTheme(context.database)({ active: false })(builder => builder.andWhere('id', id)));
}