import { ActivityTypeId } from "../../domain/activity/enums/activity-type.enum";

export interface ActivitySubmissionEntity {
    id: number;
    userId: number;
    cycleActivityId: number;
    typeId: ActivityTypeId;
    createdAt: string;
}

export const ACTIVITY_SUBMISSION_TABLE = 'activity_submission';
