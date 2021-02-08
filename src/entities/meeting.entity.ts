export interface MeetingEntity {
    id: string;
    date: string | null;
    objetive: string;
    startHour: string | null;
    endHour: string | null;
    classId: string;
}

export const MEETING_TABLE = 'meeting';
