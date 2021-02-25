import { GQLEventInfoResolvers } from "../../resolvers-types";
import { EventInfoEntity } from "../../entities/event-info.entity";


export const EventInfoEntityResolvers: Pick<GQLEventInfoResolvers, keyof EventInfoEntity> = {

    id: obj => obj.id,
    userId: obj => obj.userId,
    classId: obj => obj.classId,
    startDate: obj => obj.startDate,
    classMtgNbr: obj => obj.classMtgNbr,
    endDate: obj => obj.endDate,
    classSection: obj => obj.classSection,
    crseId: obj => obj.crseId,
    crseOfferNbr: obj => obj.crseOfferNbr,
    eventId: obj => obj.eventId,
    facilityId: obj => obj.facilityId,
    fri: obj => obj.fri,
    meetingEndTime: obj => obj.meetingEndTime,
    meetingStartTime: obj => obj.meetingStartTime,
    mon: obj => obj.mon,
    sat: obj => obj.sat,
    sessionCode: obj => obj.sessionCode,
    strm: obj => obj.strm,
    sun: obj => obj.sun,
    thurs: obj => obj.thurs,
    tues: obj => obj.tues,
    wed: obj => obj.wed,

}


export const eventInfoResolvers: GQLEventInfoResolvers = {
    ...EventInfoEntityResolvers,
}
