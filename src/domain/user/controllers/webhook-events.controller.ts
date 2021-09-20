import { Redis } from "ioredis";
import * as t from "io-ts";
import { FastifyReply, FastifyRequest } from "fastify";

import { processClassSync } from "../services/class-sync.service";
import { processCarrerSync } from "../services/carrer-sync.service";
import { API_KEYS } from "../../../shared/constants/api-keys.constant";
import { processLevelCodeSync } from "../services/level-code-sync.service";
import { DatabaseService } from "../../../shared/services/database.service";
import { processStudentUpdateEvent } from "../services/student-update.service";
import { ClassWithLocationsFullDataType } from "../types/class-full-data.type";
import { processStudentEnrollment } from "../services/student-enrollment.service";
import { WebhookErrorResponse, WebhookResponse } from "../types/webhook-events.types";
import { processStudentClassTransfer } from "../services/student-class-transfer.service";
import { getLogById, insertLog, updateLog } from "../../../shared/repositories/log.repository";
import { processStudentEnrollmentCancellation } from "../services/student-enrollment-cancellation.service";
import { processStudentActivityTimerCancellation } from "../services/student-activity-timer-cancellation.service";
import { processStudentMaterialEvent } from "../services/student-material.service";


const UserDataType = t.type({
    id: t.string,
    name: t.string,
    macId: t.union([t.string, t.null]),
    macPass: t.union([t.string, t.null]),
});

export const classSyncEventData = t.type({
    class: ClassWithLocationsFullDataType,
});

const ClassSyncEventType = t.type({
    id: t.string,
    type: t.literal('CLASS_SYNC'),
    data: classSyncEventData
});

export const CarrerSyncDataType = t.array(
    t.type({
        carrer: t.string,
        roles: t.array(t.string),
    })
);

export const ProcessCarrerSyncType = t.type({
    id: t.string,
    type: t.literal("CARRER_SYNC"),
    data: CarrerSyncDataType,
});

const StudentUpdateEventType = t.type({
    id: t.string,
    type: t.literal("STUDENT_UPDATE"),
    data: t.type({
        userId: t.string,
        name: t.union([t.string, t.null, t.undefined]),
        macId: t.union([t.string, t.null, t.undefined]),
        macPass: t.union([t.string, t.null, t.undefined]),
        accountId: t.union([t.string, t.null, t.undefined]),
    }),
});

export const LevelCodeSyncDataType = t.type({
    levelCodeId: t.number,
    code: t.string,
    description: t.union([t.string, t.null, t.undefined]),
    active: t.union([t.boolean, t.undefined]),
    learningMore: t.union([t.literal('paginab2c'), t.literal('eyoung'), t.literal('spboost'), t.literal("podcast"), t.null, t.undefined]),
});

export const ProcessLevelCodeSyncType = t.type({
    id: t.string,
    type: t.literal("LEVEL_CODE_SYNC"),
    data: LevelCodeSyncDataType,
});

export const studantEnrollmentNewData = t.type({
    user: UserDataType,
    ClassId: t.string,
});

// const studantEnrollmentOldData = t.type({
//     user: UserDataType,
//     class: ClassDataType,
// })

// export const studantEnrollmentData = t.union([studantEnrollmentNewData, studantEnrollmentOldData])

const StudentEnrollmentEventType = t.type({
    id: t.string,
    type: t.literal('STUDENT_ENROLLMENT'),
    data: studantEnrollmentNewData,
});

export const StudentClassTransferClassByIdType = t.type({
    userId: t.string,
    oldClassId: t.string,
    newClassId: t.string,
});

const StudentClassTransferClassType = t.type({
    id: t.string,
    type: t.literal('STUDENT_CLASS_TRANSFER'),
    data: StudentClassTransferClassByIdType
});

const StudentEnrollmentCancellationEventType = t.type({
    id: t.string,
    type: t.literal('STUDENT_ENROLLMENT_CANCELLATION'),
    data: t.type({
        userId: t.string,
        classId: t.string,
    }),
});

const StudentActivityTimerCancellationEventType = t.type({
    id: t.string,
    type: t.literal("STUDENT_ACTIVITY_TIMER_CANCELLATION"),
    data: t.type({
        userId: t.string,
        classId: t.string,
    }),
});

const materialArray = t.type({
    isbn: t.string,
    author: t.string,
    title: t.string,
    publisher: t.string,
    coverImg: t.string,
})

export const studentMaterialEventData = t.type({
    userId: t.string,
    classId: t.string,
    isInternal: t.string,
    acquiredLanguageBooster: t.union([ t.boolean, t.string]),
    CourseMaterials: t.array(materialArray)
})

const StudentMaterialSyncEventType = t.type({
    id: t.string,
    type: t.literal("COURSE_MATERIALS"),
    data: studentMaterialEventData,
});

const WebhookEventType = t.union([
    ClassSyncEventType,
    ProcessCarrerSyncType,
    StudentUpdateEventType,
    ProcessLevelCodeSyncType,
    StudentEnrollmentEventType,
    StudentClassTransferClassType,
    StudentEnrollmentCancellationEventType,
    StudentActivityTimerCancellationEventType,
    StudentMaterialSyncEventType
]);

export const webhookEventsController = (db: DatabaseService, readonlyDatabase: DatabaseService, redis?: Redis) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const loggerId = await insertLog(db)({
        body: JSON.stringify(request.body),
        status: "created",
    });

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
    } try {
        const decodedBody = WebhookEventType.decode(request.body);
        if (decodedBody._tag === 'Left') {
            const error = decodedBody.left[0].context.filter(item => item.key !== "3" && item.key !== "" && item.key !== "data" && item.key !== "class");
            reply.status(400);
            const response: WebhookErrorResponse = {
                success: false,
                message: {
                    status: "Invalid input: ",
                    error: error.length > 0 ? error : decodedBody.left[0].context,
                }
            };
            reply.send(response);
            await updateLog(db)({
                status: "error",
                body: JSON.stringify(
                    { error: response, body: request.body }
                )
            })(where => where.where("id", "=", loggerId));
            return;
        }

        const body = decodedBody.right;
        request.log.info(body, `Received webhook request of type ${body.type}`);
        await updateLog(db)({
            status: "valid-input",
            body: JSON.stringify(
                { body: body }
            ), key: body.id,
        })(where => where.where("id", "=", loggerId));

        let response: WebhookResponse;
        switch (body.type) {
            case 'STUDENT_CLASS_TRANSFER': {
                response = await processStudentClassTransfer(db, request.log, redis)(body);
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
                response = await processClassSync(db, readonlyDatabase, request.log, redis)(body);
                break;
            }
            case 'STUDENT_UPDATE': {
                response = await processStudentUpdateEvent(db, request.log)(body);
                break;
            }
            case 'LEVEL_CODE_SYNC': {
                response = await processLevelCodeSync(db, request.log)(body);
                break;
            }
            case 'CARRER_SYNC': {
                response = await processCarrerSync(db, request.log)(body);
                break;
            }
            case 'COURSE_MATERIALS': {
                response = await processStudentMaterialEvent(db, readonlyDatabase, request.log)(body);
                break;
            }
            case 'STUDENT_ACTIVITY_TIMER_CANCELLATION': {
                response = await processStudentActivityTimerCancellation(db, request.log)(body);
                break;
            }
            default: {
                response = {
                    success: false,
                    message: `Event not supported.`,
                };
            }
        }

        const responseStatus = response.success ? 200 : 400;
        reply.status(responseStatus);
        reply.send(response);
        request.log.info(body, `response generated to webhook request of id ${body.id} with response ${response} loggerid ${loggerId}`);
    } catch (error) {
        const webhookResponse: WebhookErrorResponse = {
            success: false,
            message: error?.message || 'Unexpected error',
        };
        reply.status(400);
        reply.send(webhookResponse);

        const log = await getLogById(db)(loggerId);
        await updateLog(db)({
            status: "error",
            body: JSON.stringify({
                body: JSON.parse(log?.body || ""),
                error: error.message || "",
            })
        })(where => where.where("id", "=", loggerId));
        request.log.info(webhookResponse as any, `Received webhook with error, loggerId ${loggerId}`);
    }
}
