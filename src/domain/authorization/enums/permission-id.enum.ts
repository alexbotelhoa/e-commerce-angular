import { EnumLiteral } from "../../../shared/types/enum-literal.type";

/**
 * This is string-based because it is not intended to be persisted in the database, as it will be kept in-memory
 */
export const PermissionId = {
    MANAGE_LEVEL: 'MANAGE_LEVEL',
    MANAGE_THEME: 'MANAGE_THEME',
    MANAGE_CYCLE: 'MANAGE_CYCLE',
    MANAGE_ACTIVITY: 'MANAGE_ACTIVITY',
    EXECUTE_ACTIVITY: 'EXECUTE_ACTIVITY',
    MANAGE_COMMENTS: 'MANAGE_COMMENTS',
    MANAGE_CHALLENGE: 'MANAGE_CHALLENGE',
    MANAGE_NEWSLETTER: 'MANAGE_NEWSLETTER',
    MANAGE_CLASS: 'MANAGE_CLASS',
    HORIZON_ONE: 'HORIZON_ONE',
    MY_QUESTIONS: 'MY_QUESTIONS',
    CHAT_ETUTOR: 'CHAT_ETUTOR',
    COURSES_ETUTOR: 'COURSES_ETUTOR',
} as const;

export type PermissionId = EnumLiteral<typeof PermissionId>;
