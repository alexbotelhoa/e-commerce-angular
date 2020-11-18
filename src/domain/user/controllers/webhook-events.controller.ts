import { FastifyReply, FastifyRequest } from "fastify";
import * as t from "io-ts";
import { API_KEYS } from "../../../shared/constants/api-keys.constant";
import { DatabaseService } from "../../../shared/services/database.service";
import { processStudentClassTransfer } from "../services/student-class-transfer.service";
import { processStudentEnrollmentCancellation } from "../services/student-enrollment-cancellation.service";
import { processStudentEnrollment } from "../services/student-enrollment.service";
import { WebhookErrorResponse, WebhookResponse } from "../types/webhook-events.types";

const UserDataType = t.type({
    id: t.string,
    name: t.string,
});

const LevelDataType = t.type({
    id: t.number,
    code: t.string,
})

const ClassDataType = t.type({
    id: t.string,
    name: t.string,
    institutionId: t.string,
    periodId: t.string,
    sessionId: t.string,
    carrerId: t.string,
    startDate: t.string,
    endDate: t.string,
    level: LevelDataType,
})

const StudentEnrollmentEventType = t.type({
    id: t.string,
    type: t.literal('STUDENT_ENROLLMENT'),
    data: t.type({
        user: UserDataType,
        class: ClassDataType,
    }),
});

const StudentClassTransferEventType = t.exact(
    t.type({
        id: t.string,
        type: t.literal('STUDENT_CLASS_TRANSFER'),
        data: t.type({
            userId: t.string,
            oldClassId: t.string,
            newClass: ClassDataType,
        }),
    }));

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
    StudentClassTransferEventType,
    StudentEnrollmentCancellationEventType,
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
                message: `Invalid input: ${JSON.stringify(decodedBody.left)}`,
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
