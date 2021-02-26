export interface EventInfoEntity {
    id: string;
    userId: string;
    classId: string;
    eventId: string;
    crseId: string;
    crseOfferNbr: string;
    strm: string;
    sessionCode: string;
    classSection: string;
    classMtgNbr: string;
    facilityId: string;
    meetingStartTime: string;
    meetingEndTime: string;
    mon: string;
    tues: string;
    wed: string;
    thurs: string;
    fri: string;
    sat: string;
    sun: string;
    startDate: string;
    endDate: string;
}

export const EVENT_INFO_TABLE = 'event_info';
