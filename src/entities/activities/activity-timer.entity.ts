export interface ActivityTimerEntity {
    id: number;
    userId: number;
    cycleActivityId: number;
    startTime: string;
    completionTime: string | null;
    completed: boolean;
}

export const ACTIVITY_TIMER_TABLE = 'activity_timer';
