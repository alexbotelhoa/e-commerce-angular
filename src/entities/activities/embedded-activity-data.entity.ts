import { ActivityData } from "./activity-data.interface";

export interface EmbeddedActivityDataEntity extends ActivityData {
    url: string;
}
