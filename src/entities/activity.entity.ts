import { ActivityTypeId } from "../domain/activity/enums/activity-type.enum";
import { EntityMetadata } from "../shared/types/entity-metadata.type";

export interface ActivityEntity<T extends ActivityTypeId = ActivityTypeId> {
    id: number;
    name: string;
    description: string | null;
    typeId: T;
    active: boolean;
    estimatedTime: string;
}

export const ACTIVITY_TABLE = 'activity';

export type ActivityEntityMetadata = EntityMetadata<ActivityEntity, typeof ACTIVITY_TABLE>;

export const ActivityEntityMetadata: ActivityEntityMetadata = {
    table: ACTIVITY_TABLE,
    primaryColumn: 'id',
    columns: ['id', 'name', 'description', 'typeId', 'active', 'estimatedTime'],
}
