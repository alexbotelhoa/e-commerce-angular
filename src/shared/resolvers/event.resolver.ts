import { GQLEventResolvers } from "../../resolvers-types";
import { EventEntity } from "../../entities/event.entity";
import { selectEventAdress } from "../repositories/event-adress.repository";
import { selectEventInfo } from "../repositories/event-info.repository";
import { selectEventInstructor } from "../repositories/event-instructor.repository";


export const EventEntityResolvers: Pick<GQLEventResolvers, keyof EventEntity> = {
    id: obj => obj.id,
    userId: obj => obj.userId,
    classId: obj => obj.classId,
    startDate: obj => obj.startDate,
    sessionId: obj => obj.sessionId,
    endDate: obj => obj.endDate,
    vacancies: obj => obj.vacancies,
    enrolled: obj => obj.enrolled,
    periodId: obj => obj.periodId,
    subject: obj => obj.subject,
    status: obj => obj.status,
    teacherConclusion: obj => obj.teacherConclusion,
    career: obj => obj.career,
    zoomRoom: obj => obj.zoomRoom,
    link: obj => obj.link,
    typeFaceToFace: obj => obj.typeFaceToFace,
    category: obj => obj.category,
    statusEnrollment: obj => obj.statusEnrollment,
    daysOfWeekSchedule: obj => obj.daysOfWeekSchedule,
    title: obj => obj.title,
    lastUpdateTime: obj => obj.lastUpdateTime,
}


export const eventResolvers: GQLEventResolvers = {
    ...EventEntityResolvers,
    adress: async (obj, a, b) => (await selectEventAdress(b.database).where("eventId", "=", obj.id))[0],
    eventInfo: async (obj, a, b) => await selectEventInfo(b.database).where("eventId", "=", obj.id),
    instructor: async (obj, a, b) => await selectEventInstructor(b.database).where("eventId", "=", obj.id),
}
