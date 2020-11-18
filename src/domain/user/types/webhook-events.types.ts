import { StudentClassTransferData } from "../services/student-class-transfer.service";
import { StudentEnrollmentCancellationData } from "../services/student-enrollment-cancellation.service";
import { StudentEnrollmentData } from "../services/student-enrollment.service";

export interface WebhookSuccessResponse {
    success: true;
}

export interface WebhookErrorResponse {
    success: false;
    message: string;
}

export type WebhookResponse = WebhookSuccessResponse | WebhookErrorResponse;

export interface StudentEnrollmentEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT',
    data: StudentEnrollmentData;
}

export interface StudentEnrollmentCancellationEvent {
    id: string;
    type: 'STUDENT_ENROLLMENT_CANCELLATION';
    data: StudentEnrollmentCancellationData;
}

export interface StudentClassTransferEvent {
    id: string;
    type: 'STUDENT_CLASS_TRANSFER',
    data: StudentClassTransferData;
}

export type WebhookEvent = StudentEnrollmentEvent | StudentEnrollmentCancellationEvent | StudentClassTransferEvent;

