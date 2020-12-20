import * as t from "io-ts";


const LevelDataType = t.type({
    id: t.number,
    code: t.string,
})

export const ClassDataType = t.type({
    id: t.string,
    name: t.string,
    institutionId: t.union([t.string, t.null]),
    periodId: t.union([t.string, t.null]),
    sessionId: t.union([t.string, t.null]),
    carrerId: t.union([t.string, t.null]),
    startDate: t.union([t.string, t.null]),
    endDate: t.union([t.string, t.null]),
    level: LevelDataType,
})

export type ClassData = t.TypeOf<typeof ClassDataType>

