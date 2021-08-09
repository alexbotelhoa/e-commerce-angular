import { ActivityTypeId } from "../enums/activity-type.enum";
import { ActivityType } from "../types/activity-type.type";

export const ActivityTypeById: Record<ActivityTypeId, ActivityType> = {
    [ActivityTypeId.EMBEDDED]: {
        id: ActivityTypeId.EMBEDDED,
        name: 'Embedded Activity',
        description: 'An activity provided by an url that is embedded on the page',
    },
    [ActivityTypeId.HTML]: {
        id: ActivityTypeId.HTML,
        name: 'HTML Activity',
        description: 'An activity provided by custom HTML'
    },
}

export async function getActivityTypeById(activityId: ActivityTypeId): Promise<ActivityType> {
    return ActivityTypeById[activityId];
}