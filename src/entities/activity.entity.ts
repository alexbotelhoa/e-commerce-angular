import { ActivityTypeId } from "../domain/activity/enums/activity-type.enum";

export interface ActivityEntity<T extends ActivityTypeId = ActivityTypeId> {
    id: number;
    name: string;
    description: string | null;
    order: number;
    cycleId: string;
    typeId: T
}

export const ACTIVITY_TABLE = 'activity';
