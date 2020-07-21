import { ActivityData } from "./activity-data.interface";

export interface EmbeddedActivityDataEntity extends ActivityData {
    url: string;
}

export const EMBEDDED_ACTIVITY_DATA_TABLE = 'embeddedActivityData';
