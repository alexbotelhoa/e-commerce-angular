import { EnumLiteral } from "../../../shared/types/enum-literal.type";

export const LevelTypeId = {
    ADULT: 1,
    YOUNG: 2,
} as const;

export type LevelTypeId = EnumLiteral<typeof LevelTypeId>;
export type LevelTypeIdCode = keyof typeof LevelTypeId;

