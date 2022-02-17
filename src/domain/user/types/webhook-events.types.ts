import * as t from "io-ts";
import {
    ClassSyncEventData,
    CarrerSyncEventData,
    LevelCodeSyncEventData,
    CurseMaterialSyncEventData,
    StudentEnrollmentSyncEventData,
    StudentClassTransferSyncEventData,
} from "../controllers/webhook-events.controller";
import { StudentEnrollmentCancellationData } from "../services/student-enrollment-cancellation.service";
import { StudentActivityTimerCancellationData } from "../services/student-activity-timer-cancellation.service";

export interface WebhookSuccessResponse {
    success: true;
}

export interface WebhookErrorResponse {
    success: false;
    message: string | Record<string, unknown>;
}

export type WebhookResponse = WebhookSuccessResponse | WebhookErrorResponse;

export interface StudentEnrollmentEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT',
    data: t.TypeOf<typeof StudentEnrollmentSyncEventData>;
}

export interface StudentEnrollmentCancellationEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT_CANCELLATION';
    data: StudentEnrollmentCancellationData;
}

export interface StudentActivityTimerCancellationEvent {
    id: string;
    type: 'STUDENT_ACTIVITY_TIMER_CANCELLATION';
    data: StudentActivityTimerCancellationData;
}

export interface StudentClassTransferEvent {
    id: string;
    type: 'STUDENT_CLASS_TRANSFER',
    data: t.TypeOf<typeof StudentClassTransferSyncEventData>;
}

export interface ClassSyncEvent {
    id: string;
    type: 'CLASS_SYNC',
    data: t.TypeOf<typeof ClassSyncEventData>
}

export interface LevelCodeSyncEvent {
    id: string;
    type: 'LEVEL_CODE_SYNC',
    data: t.TypeOf<typeof LevelCodeSyncEventData>
}

export interface CarrerSyncEvent {
    id: string;
    type: 'CARRER_SYNC',
    data: t.TypeOf<typeof CarrerSyncEventData>
}

export interface CourseMaterialSyncEvent {
    id: string;
    type: 'COURSE_MATERIALS',
    data: t.TypeOf<typeof CurseMaterialSyncEventData>
}

export type WebhookEvent =
    | StudentEnrollmentEvent
    | StudentEnrollmentCancellationEvent
    | StudentActivityTimerCancellationEvent
    | StudentClassTransferEvent
    | ClassSyncEvent
    | LevelCodeSyncEvent
    | CarrerSyncEvent
    | CourseMaterialSyncEvent;
