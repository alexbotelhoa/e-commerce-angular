export interface EventEntity {
    id: string;
    userId: string;
    classId: string;
    periodId: string;
    sessionId: string;
    startDate: string,
    endDate: string,
    vacancies: string;
    enrolled: string;
    subject: string;
    daysOfWeekSchedule: string;
    status: string;
    teacherConclusion: string;
    career: string;
    zoomRoom: string;
    link: string;
    typeFaceToFace: string;
    category: string;
    statusEnrollment: string;
}

export const EVENT_TABLE = 'event';
