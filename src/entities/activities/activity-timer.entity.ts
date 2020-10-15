export interface ActivityTimerEntity {
    id: number;
    userId: string;
    cycleActivityId: number;
    startTime: string;
    completionTime: string | Date | null;
    completed: boolean;
    classId: string;
}

export const ACTIVITY_TIMER_TABLE = 'activity_timer';
