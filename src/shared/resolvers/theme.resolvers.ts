import { GQLThemeResolvers } from "../../resolvers-types";
import { ThemeEntity } from "../../entities/theme.entity";

export const themeEntityResolvers: Pick<GQLThemeResolvers, keyof ThemeEntity> = {
    id: obj => obj.id.toString(),
    active: obj => obj.active,
    name: obj => obj.name,
}

export const themeResolvers: GQLThemeResolvers = {
    ...themeEntityResolvers,
}
