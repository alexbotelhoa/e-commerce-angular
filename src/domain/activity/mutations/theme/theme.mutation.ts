import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getThemeById, insertTheme, updateTheme } from "../../../../shared/repositories/theme.repository";

export const createThemeMutationResolver: GQLMutationResolvers['createTheme'] = async (obj, { data }, context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getThemeById(context.database)(await insertTheme(context.database)(data)))!;
}

export const toggleThemeState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateTheme'] | GQLMutationResolvers['deactivateTheme'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getThemeById(db)(await updateTheme(db)(data)(builder => builder.andWhere('id', id))))!;
        }