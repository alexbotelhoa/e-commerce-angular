export interface EventEntity {
    id: string;
    userId: string;
    classId: string;
    period: string;
    aula: string;
    startDate: string,
    endDate: string,
    vacancies: string;
    enrolled: string;
    subject: string;
    DaysOfWeekSchedule: string;
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
