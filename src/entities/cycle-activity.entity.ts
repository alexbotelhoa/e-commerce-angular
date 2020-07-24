export interface CycleActivityEntity {
    id: number;
    cycleId: number;
    activityId: number;
    order: number;
}

export const CYCLE_ACTIVITY_TABLE = 'cycle_activity';
