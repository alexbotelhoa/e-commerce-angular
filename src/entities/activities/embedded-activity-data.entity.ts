import { ActivityData } from "./activity-data.interface";

export interface EmbeddedActivityDataEntity extends ActivityData {
    url: string;
    height: number;
}

export const EMBEDDED_ACTIVITY_DATA_TABLE = 'embedded_activity_data';
