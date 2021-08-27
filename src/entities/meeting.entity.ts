export interface MeetingEntity {
    id: string;
    date: string | null;
    objetive: string;
    startHour: string | null;
    endHour: string | null;
    classId: string;
    attendTmpltNbr: string;
    facilityId: string;
    enabled: boolean;
    teacherNotes: string | null;
    homework: string | null;
}

export const MEETING_TABLE = 'meeting';
