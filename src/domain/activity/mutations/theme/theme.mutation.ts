import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getThemeById, insertTheme, updateTheme } from "../../../../shared/repositories/theme.repository";
import { insertThemeIcon, updateThemeIcon } from "../../../../shared/repositories/theme-icon.repository"

export const createThemeMutationResolver: GQLMutationResolvers['createTheme'] = async (obj, { data: { endColor, startColor, name, icon } }, { database: db }) => {
    const insertedId = await db.transaction(async trx => {
        const id = await insertTheme(trx)({ name, endColor, startColor });
        await insertThemeIcon(trx)({
            themeId: id,
            ...icon
        });
        return id;
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getThemeById(db)(insertedId))!;
}

export const updateThemeMutationResolver: GQLMutationResolvers['updateTheme'] = async (obj, { data }, context) => {
    const theme = await getThemeById(context.database);
    if (!theme) {
        throw new Error(`Theme with id ${data.id} was not found.`);
    }

    await context.database.transaction(async trx => {
        await updateTheme(trx)({
            name: data.name,
            active: data.active,
            endColor: data.endColor,
            startColor: data.startColor,
        })(builder => builder.andWhere('id', data.id));

        await updateThemeIcon(trx)({
            content: data.icon.content,
        })(builder => builder.andWhere('themeId', data.id));
    })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getThemeById(context.database)(data.id))!;
}

export const toggleThemeState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateTheme'] | GQLMutationResolvers['deactivateTheme'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            await updateTheme(db)(data)(builder => builder.andWhere('id', parseInt(id)))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getThemeById(db)(id))!;
        }
