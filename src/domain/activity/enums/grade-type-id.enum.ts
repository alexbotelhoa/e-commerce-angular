import { EnumLiteral } from "../../../shared/types/enum-literal.type";

export const GradeTypeId = {
    VIEW: 1,
    COMPLETION: 2,
} as const;

export type GradeTypeId = EnumLiteral<typeof GradeTypeId>;
export type GradeTypeIdCode = keyof typeof GradeTypeId;

