import * as t from "io-ts";
import { StudentEnrollmentCancellationData } from "../services/student-enrollment-cancellation.service";
import { classSyncEventData, studantEnrollmentNewData, StudentClassTransferClassByIdType, LevelCodeSyncDataType, CarrerSyncDataType } from "../controllers/webhook-events.controller"
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
    data: t.TypeOf<typeof studantEnrollmentNewData>;
}

export interface StudentEnrollmentCancellationEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT_CANCELLATION';
    data: StudentEnrollmentCancellationData;
}

export interface StudentClassTransferEvent {
    id: string;
    type: 'STUDENT_CLASS_TRANSFER',
    data: t.TypeOf<typeof StudentClassTransferClassByIdType>;
}

export interface ClassSyncEvent {
    id: string;
    type: 'CLASS_SYNC',
    data: t.TypeOf<typeof classSyncEventData>
}

export interface LevelCodeSyncEvent {
    id: string;
    type: 'LEVEL_CODE_SYNC',
    data: t.TypeOf<typeof LevelCodeSyncDataType>
}

export interface CarrerSyncEvent {
    id: string;
    type: 'CARRER_SYNC',
    data: t.TypeOf<typeof CarrerSyncDataType>
}

export interface StudentActivityTimerCancellationEvent {
    id: string;
    type: 'STUDENT_ACTIVITY_TIMER_CANCELLATION';
    data: StudentActivityTimerCancellationData;
}



export type WebhookEvent =
    | StudentEnrollmentEvent
    | StudentEnrollmentCancellationEvent
    | StudentActivityTimerCancellationEvent
    | StudentClassTransferEvent
    | LevelCodeSyncEvent
    | CarrerSyncEvent;

