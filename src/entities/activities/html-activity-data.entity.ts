import { ActivityData } from "./activity-data.interface";

export interface HtmlActivityDataEntity extends ActivityData {
    html: string;
}

export const HTML_ACTIVITY_DATA_TABLE = 'htmlActivityData';
