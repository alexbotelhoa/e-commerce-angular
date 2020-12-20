import { FastifyReply, FastifyRequest } from "fastify";
import * as t from "io-ts";
import { API_KEYS } from "../../../shared/constants/api-keys.constant";
import { DatabaseService } from "../../../shared/services/database.service";
import { processClassSync } from "../services/class-sync.service";
import { processStudentClassTransfer } from "../services/student-class-transfer.service";
import { processStudentEnrollmentCancellation } from "../services/student-enrollment-cancellation.service";
import { processStudentEnrollment } from "../services/student-enrollment.service";
import { ClassDataType } from "../types/class-data.type";
import { ClassWithLocationsFullDataType } from "../types/class-full-data.type";
import { WebhookErrorResponse, WebhookResponse } from "../types/webhook-events.types";

const UserDataType = t.type({
    id: t.string,
    name: t.string,
});




export const classSyncEventData = t.type({
    class: ClassWithLocationsFullDataType,
})

const ClassSyncEventType = t.type({
    id: t.string,
    type: t.literal('CLASS_SYNC'),
    data: classSyncEventData
})

const studantEnrollmentNewData = t.type({
    user: UserDataType,
    ClassId: t.string,
})

const studantEnrollmentOldData = t.type({
    user: UserDataType,
    class: ClassDataType,
})


export const studantEnrollmentData = t.union([studantEnrollmentNewData, studantEnrollmentOldData])


const StudentEnrollmentEventType = t.type({
    id: t.string,
    type: t.literal('STUDENT_ENROLLMENT'),
    data: studantEnrollmentData,
});

const StudentClassTransferWithClassBodyType = t.type({
    userId: t.string,
    oldClassId: t.string,
    newClass: ClassDataType,
})

const StudentClassTransferClassByIdType = t.type({
    userId: t.string,
    oldClassId: t.string,
    newClassId: t.string,
})

export const StudentClassTransferClassData = t.union([StudentClassTransferClassByIdType, StudentClassTransferWithClassBodyType])

const StudentClassTransferClassType = t.type({
    id: t.string,
    type: t.literal('STUDENT_CLASS_TRANSFER'),
    data: StudentClassTransferClassData
})

const StudentEnrollmentCancellationEventType = t.type({
    id: t.string,
    type: t.literal('STUDENT_ENROLLMENT_CANCELLATION'),
    data: t.type({
        userId: t.string,
        classId: t.string,
    }),
});


const WebhookEventType = t.union([
    StudentEnrollmentEventType,
    StudentClassTransferClassType,
    StudentEnrollmentCancellationEventType,
    ClassSyncEventType
]);

export const webhookEventsController = (db: DatabaseService) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {

    const apiKey = request.headers['lxp-api-key'];
    if (typeof apiKey !== 'string') {
        reply.status(400);
        const response: WebhookErrorResponse = {
            success: false,
            message: 'API Key not provided.',
        };
        reply.send(response);
        return;
    }
    const validApiKey = Boolean(API_KEYS.find(key => key === apiKey));
    if (!validApiKey) {
        reply.status(400);
        const response: WebhookErrorResponse = {
            success: false,
            message: 'API Key provided is not valid.',
        };
        reply.send(response);
        return;
    }

    try {
        const decodedBody = WebhookEventType.decode(request.body);
        if (decodedBody._tag === 'Left') {
            reply.status(400);
            const response: WebhookErrorResponse = {
                success: false,
                message: decodedBody.left as any,
            };
            reply.send(response);
            return;
        }

        const body = decodedBody.right;

        request.log.info(body, `Received webhook request of type ${body.type}`);

        let response: WebhookResponse;

        switch (body.type) {
            case 'STUDENT_CLASS_TRANSFER': {
                response = await processStudentClassTransfer(db, request.log)(body);
                break;
            }
            case 'STUDENT_ENROLLMENT': {
                response = await processStudentEnrollment(db, request.log)(body);
                break;
            }
            case 'STUDENT_ENROLLMENT_CANCELLATION': {
                response = await processStudentEnrollmentCancellation(db, request.log)(body);
                break;
            }
            case 'CLASS_SYNC': {
                response = await processClassSync(db, request.log)(body)
                break;
            }
            default: {
                response = {
                    success: false,
                    message: `Event not supported.`
                };
            }
        }

        const responseStatus = response.success ? 200 : 400;
        reply.status(responseStatus);
        reply.send(response);
    }
    catch (error) {
        const webhookResponse: WebhookErrorResponse = {
            success: false,
            message: error?.message || 'Unexpected error',
        };
        reply.status(400);
        reply.send(webhookResponse);
    }



}
