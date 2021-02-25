import { GQLMeetingResolvers } from "../../resolvers-types";
import { MeetingEntity } from "../../entities/meeting.entity";


export const meetingEntityResolvers: Pick<GQLMeetingResolvers, keyof MeetingEntity> = {
    id: obj => obj.id.toString(),
    classId: obj => obj.classId,
    date: obj => obj.date,
    endHour: obj => obj.endHour,
    objetive: obj => obj.objetive,
    startHour: obj => obj.startHour
}


export const meetingResolvers: GQLMeetingResolvers = {
    ...meetingEntityResolvers
}
