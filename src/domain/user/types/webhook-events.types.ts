import * as t from "io-ts";
import {
    ClassSyncEventData,
    CarrerSyncEventData,
    LevelCodeSyncEventData,
    StudentUpdateSyncEventData,
    CourseMaterialSyncEventData,
    UserRolesUpdateSyncEventData,
    StudentEnrollmentSyncEventData,
    StudentClassTransferSyncEventData,
    StudentEnrollmentCancellationSyncEventData,
    StudentActivityTimerCancellationSyncEventData,
} from "../controllers/webhook-events.controller";

export interface WebhookSuccessResponse {
    success: true;
}

export interface WebhookErrorResponse {
    success: false;
    message: string | Record<string, unknown>;
}

export type WebhookResponse = WebhookSuccessResponse | WebhookErrorResponse;

export interface ClassSyncEvent {
    id: string;
    type: 'CLASS_SYNC',
    data: t.TypeOf<typeof ClassSyncEventData>
}

export interface CarrerSyncEvent {
    id: string;
    type: 'CARRER_SYNC',
    data: t.TypeOf<typeof CarrerSyncEventData>
}

export interface LevelCodeSyncEvent {
    id: string;
    type: 'LEVEL_CODE_SYNC',
    data: t.TypeOf<typeof LevelCodeSyncEventData>
}

export interface StudentUpdateSyncEvent {
    id: string;
    type: 'STUDENT_UPDATE',
    data: t.TypeOf<typeof StudentUpdateSyncEventData>
}

export interface CourseMaterialSyncEvent {
    id: string;
    type: 'COURSE_MATERIALS',
    data: t.TypeOf<typeof CourseMaterialSyncEventData>
}

export interface UserRolesUpdateSyncEvent {
    id: string;
    type: 'USER_ROLES_UPDATE',
    data: t.TypeOf<typeof UserRolesUpdateSyncEventData>;
}

export interface StudentEnrollmentSyncEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT',
    data: t.TypeOf<typeof StudentEnrollmentSyncEventData>;
}

export interface StudentClassTransferSyncEvent {
    id: string;
    type: 'STUDENT_CLASS_TRANSFER',
    data: t.TypeOf<typeof StudentClassTransferSyncEventData>;
}

export interface StudentEnrollmentCancellationSyncEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT_CANCELLATION';
    data: t.TypeOf<typeof StudentEnrollmentCancellationSyncEventData>;
}

export interface StudentActivityTimerCancellationSyncEvent {
    id: string;
    type: 'STUDENT_ACTIVITY_TIMER_CANCELLATION';
    data: t.TypeOf<typeof StudentActivityTimerCancellationSyncEventData>;
}

export type WebhookEvent =
    | ClassSyncEvent
    | CarrerSyncEvent
    | LevelCodeSyncEvent
    | StudentUpdateSyncEvent
    | CourseMaterialSyncEvent
    | UserRolesUpdateSyncEvent
    | StudentEnrollmentSyncEvent
    | StudentClassTransferSyncEvent
    | StudentEnrollmentCancellationSyncEvent
    | StudentActivityTimerCancellationSyncEvent;
