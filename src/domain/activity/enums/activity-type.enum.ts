import { EnumLiteral } from "../../../shared/types/enum-literal.type";

export const ActivityTypeId = {
    EMBEDDED: 1,
    HTML: 2,
} as const;

export type ActivityTypeId = EnumLiteral<typeof ActivityTypeId>;
export type ActivityTypeIdCodes = keyof typeof ActivityTypeId;

