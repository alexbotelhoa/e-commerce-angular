import { EnumLiteral } from "../../../shared/types/enum-literal.type";

/**
 * This is number-based to efficiently save/retrieve from database
 */
export const RoleId = {
    ADMIN: 1,
    TEACHER: 2,
    STUDENT: 3,
} as const;

export type RoleId = EnumLiteral<typeof RoleId>;
