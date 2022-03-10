import { EnumLiteral } from "../../../shared/types/enum-literal.type";

/**
 * This is number-based to efficiently save/retrieve from database
 */
export const RoleId = {
    MASTER: 0,
    ADMIN: 1,
    TEACHER: 2,
    STUDENT: 3,
    GUARDIAN: 4,
    HORIZON_ONE: 5,
    E_TUTOR: 6
} as const;

export type RoleId = EnumLiteral<typeof RoleId>;

