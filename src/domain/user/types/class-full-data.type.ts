import * as t from "io-ts";

export const schedule = t.type({
    startHour: t.string,
    endHour: t.string,
})

export const DaysOfWeek = t.type({
    day: t.string,
    schedule: t.array(schedule),
})

export const assessment = t.type({
    value: t.string,
    description: t.string,
})

export const instructor = t.type({
    id: t.string,
    name: t.string,
    type: t.string,
    macID: t.string,
    macPass: t.string,
})

const LevelDataType = t.type({
    id: t.number,
    code: t.string,
})

const meeting = t.type({
    date: t.string,
    objetive: t.string,
    startHour: t.string,
    endHour: t.string,
    attendTmpltNbr: t.string,
    facilityId: t.string,
})

export const ClassWithLocationsFullDataType = t.type({
    id: t.string,
    name: t.string,
    status: t.string,
    crseId: t.string,
    level: LevelDataType,
    regional: t.string,
    regionalDescription: t.string,
    campus: t.string,
    campusDescription: t.string,
    local: t.string,
    localDescription: t.string,
    institutionId: t.string,
    carrerId: t.string,
    periodId: t.string,
    sessionId: t.string,
    hasECampusAccess: t.boolean,
    mnft: t.boolean,
    academicAge: t.string,
    startDate: t.string,
    endDate: t.string,
    daysOfWeek: t.array(DaysOfWeek),
    schedule: t.string,
    reportCard1P: t.string,
    reportCard2P: t.string,
    assessment: t.array(assessment),
    meetings: t.union([t.array(meeting), t.null, t.undefined]),
    instructor: t.array(instructor)
})


export type ClassFull = t.TypeOf<typeof ClassWithLocationsFullDataType>
