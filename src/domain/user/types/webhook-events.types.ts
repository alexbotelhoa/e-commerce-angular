import * as t from "io-ts";
import {
    ClassSyncEventData,
    CarrerSyncEventData,
    LevelCodeSyncEventData,
    StudentUpdateSyncEventData,
    CourseMaterialSyncEventData,
    StudentEnrollmentSyncEventData,
    StudentRolesUpdateSyncEventData,
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

export interface StudentEnrollmentSyncEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT',
    data: t.TypeOf<typeof StudentEnrollmentSyncEventData>;
}

export interface StudentRolesUpdateSyncEvent {
    id: string;
    type: 'USER_ROLES_UPDATE',
    data: t.TypeOf<typeof StudentRolesUpdateSyncEventData>;
}

export interface StudentClassTransferSyncEvent {
    id: string;
    type: 'STUDENT_CLASS_TRANSFER',
    data: t.TypeOf<typeof StudentClassTransferSyncEventData>;
}

export interface StudentEnrollmentCancellationSyncEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT_CANCELLATION';
    data: StudentEnrollmentCancellationData;
}

export interface StudentActivityTimerCancellationSyncEvent {
    id: string;
    type: 'STUDENT_ACTIVITY_TIMER_CANCELLATION';
    data: StudentActivityTimerCancellationData;
}

export type WebhookEvent =
    | ClassSyncEvent
    | CarrerSyncEvent
    | LevelCodeSyncEvent
    | StudentUpdateSyncEvent
    | CourseMaterialSyncEvent
    | StudentEnrollmentSyncEvent
    | StudentRolesUpdateSyncEvent
    | StudentClassTransferSyncEvent
    | StudentEnrollmentCancellationSyncEvent
    | StudentActivityTimerCancellationSyncEvent;
