import { database } from "faker";
import { CLASS_TABLE } from "../../../../entities/class.entity";
import { CycleEntity, CYCLE_TABLE } from "../../../../entities/cycle.entity";
import { LEVEL_CODE_TABLE } from "../../../../entities/level-code.entity";
import { LEVEL_THEME_TABLE } from "../../../../entities/level-theme.entity";
import { LEVEL_TABLE } from "../../../../entities/level.entity";
import { GQLQueryResolvers } from "../../../../resolvers-types";

export const classCyclesQueryResolver: GQLQueryResolvers['classCycles'] = async (obj, { classId }, { database }) => {
    const cycles = await database
        .select<CycleEntity[]>(`${CYCLE_TABLE}.*`)
        .from(CLASS_TABLE)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.id`, `${CLASS_TABLE}.levelCodeId`)
        .innerJoin(LEVEL_TABLE, `${LEVEL_TABLE}.id`, `${LEVEL_CODE_TABLE}.levelId`)
        .innerJoin(LEVEL_THEME_TABLE, `${LEVEL_THEME_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
        .innerJoin(CYCLE_TABLE, `${CYCLE_TABLE}.levelThemeId`, `${LEVEL_THEME_TABLE}.id`)
        .andWhere(`${CLASS_TABLE}.id`, classId);
    return cycles;
}
