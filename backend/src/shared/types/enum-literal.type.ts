export type EnumLiteral<T extends Record<string, unknown>> = T[keyof T];
