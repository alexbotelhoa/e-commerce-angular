export interface ActivityTimerEntity {
    id: number;
    userId: number;
    cycleActivityId: number;
    startTime: string;
    completionTime: string | Date | null;
    completed: boolean;
    classId: number;
}

export const ACTIVITY_TIMER_TABLE = 'activity_timer';
