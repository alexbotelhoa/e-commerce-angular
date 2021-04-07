import * as t from "io-ts";
import { StudentEnrollmentCancellationData } from "../services/student-enrollment-cancellation.service";
import { studantEnrollmentData, StudentClassTransferClassData, classSyncEventData } from "../controllers/webhook-events.controller"
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
    data: t.TypeOf<typeof studantEnrollmentData>;
}

export interface StudentEnrollmentCancellationEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT_CANCELLATION';
    data: StudentEnrollmentCancellationData;
}

export interface StudentClassTransferEvent {
    id: string;
    type: 'STUDENT_CLASS_TRANSFER',
    data: t.TypeOf<typeof StudentClassTransferClassData>;
}

export interface ClassSyncEvent {
    id: string;
    type: 'CLASS_SYNC',
    data: t.TypeOf<typeof classSyncEventData>
}

export type WebhookEvent = StudentEnrollmentEvent | StudentEnrollmentCancellationEvent | StudentClassTransferEvent;

