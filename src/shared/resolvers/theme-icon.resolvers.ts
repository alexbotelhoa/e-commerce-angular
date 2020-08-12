import { GQLThemeIconResolvers } from "../../resolvers-types";
import { ThemeIconEntity } from "../../entities/themes/theme-icon.entity";

export const themeIconEntityResolvers: Pick<GQLThemeIconResolvers, keyof ThemeIconEntity> = {
    themeId: obj => obj.themeId.toString(),
    content: obj => obj.content
}



export const themeIconResolvers: GQLThemeIconResolvers = {
    ...themeIconEntityResolvers,
}
