import { CLASS_TABLE } from "../../../../entities/class.entity";
import { LEVEL_CODE_TABLE } from "../../../../entities/level-code.entity";
import { LevelThemeEntity, LEVEL_THEME_TABLE } from "../../../../entities/level-theme.entity";
import { LEVEL_TABLE } from "../../../../entities/level.entity";
import { GQLQueryResolvers } from "../../../../resolvers-types";

export const classLevelThemesQueryResolver: GQLQueryResolvers['classLevelThemes'] = async (obj, { classId }, { database }) => {
    const levelThemes = await database
        .select<LevelThemeEntity[]>(`${LEVEL_THEME_TABLE}.*`)
        .from(CLASS_TABLE)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.id`, `${CLASS_TABLE}.levelCodeId`)
        .innerJoin(LEVEL_TABLE, `${LEVEL_TABLE}.id`, `${LEVEL_CODE_TABLE}.levelId`)
        .innerJoin(LEVEL_THEME_TABLE, `${LEVEL_THEME_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
        .andWhere(`${CLASS_TABLE}.id`, classId);
    console.log(levelThemes);
    return levelThemes;
}
