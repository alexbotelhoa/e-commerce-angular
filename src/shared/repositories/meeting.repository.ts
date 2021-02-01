


import { MeetingEntity, MEETING_TABLE } from "../../entities/meeting.entity";
import { createRepository } from "../services/repository.service";

export const {
    getById: getMeetingById,
    getManyByIds: getMeetingsByIds,
    insert: insertMeeting,
    select: selectMeeting,
    update: updateMeeting,
    delete: deleteMeeting,
    deleteAll: deleteAllMeetings,
    count: countMeetings,
} = createRepository<MeetingEntity>(MEETING_TABLE, 'id');
