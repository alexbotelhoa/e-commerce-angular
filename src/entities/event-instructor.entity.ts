export interface EventInstructorEntity {
    id: string;
    name: string;
    eventId: string;
    macId: string | null;
    macPass: string | null;
}

export const EVENT_INSTRUCTOR_TABLE = 'event_instructor';
