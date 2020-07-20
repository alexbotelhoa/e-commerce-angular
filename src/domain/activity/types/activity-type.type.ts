import { ActivityTypeId } from "../enums/activity-type.enum";

export interface ActivityType {
    id: ActivityTypeId;
    name: string;
    description: string;
}
