import * as t from "io-ts";
import { Redis } from "ioredis";
import { FastifyReply, FastifyRequest } from "fastify";

import { processClassSync } from "../services/class-sync.service";
import { processCarrerSync } from "../services/carrer-sync.service";
import { API_KEYS } from "../../../shared/constants/api-keys.constant";
import { processLevelCodeSync } from "../services/level-code-sync.service";
import { DatabaseService } from "../../../shared/services/database.service";
import { ClassWithLocationsFullDataType } from "../types/class-full-data.type";
import { processStudentUpdateSync } from "../services/student-update-sync.service";
import { processCourseMaterialSync } from "../services/course-material-sync.service";
import { WebhookErrorResponse, WebhookResponse } from "../types/webhook-events.types";
import { processUserRolesUpdateSync } from "../services/user-roles-update.service-sync";
import { processStudentEnrollmentSync } from "../services/student-enrollment-sync.service";
import { getLogById, insertLog, updateLog } from "../../../shared/repositories/log.repository";
import { processStudentClassTransferSync } from "../services/student-class-transfer-sync.service";
import { processStudentEnrollmentCancellationSync } from "../services/student-enrollment-cancellation-sync.service";
import { processStudentActivityTimerCancellationSync } from "../services/student-activity-timer-cancellation-sync.service";

export const ClassSyncEventData = t.type({
    class: ClassWithLocationsFullDataType,
});

const ClassSyncEventType = t.type({
    id: t.string,
    type: t.literal('CLASS_SYNC'),
    data: ClassSyncEventData,
});

export const CarrerSyncEventData = t.array(
    t.type({
        carrer: t.string,
        roles: t.array(t.string),
    })
);

const CarrerSyncEventType = t.type({
    id: t.string,
    type: t.literal("CARRER_SYNC"),
    data: CarrerSyncEventData,
});

export const LevelCodeSyncEventData = t.type({
    levelCodeId: t.number,
    code: t.string,
    description: t.union([t.string, t.null, t.undefined]),
    active: t.union([t.boolean, t.undefined]),
    learningMore: t.union([
        t.literal('kanttum'),
        t.literal('paginab2c'),
        t.literal('eyoung'),
        t.literal('spboost'),
        t.literal("podcast"),
        t.null,
        t.undefined
    ]),
});

const LevelCodeSyncEventType = t.type({
    id: t.string,
    type: t.literal("LEVEL_CODE_SYNC"),
    data: LevelCodeSyncEventData,
});

export const StudentUpdateSyncEventData = t.type({
    userId: t.string,
    name: t.union([t.string, t.null, t.undefined]),
    macId: t.union([t.string, t.null, t.undefined]),
    macPass: t.union([t.string, t.null, t.undefined]),
    accountId: t.union([t.string, t.null, t.undefined]),
});

const StudentUpdateSyncEventType = t.type({
    id: t.string,
    type: t.literal("STUDENT_UPDATE"),
    data: StudentUpdateSyncEventData,
});

const materialArray = t.type({
    id: t.string,
    isbn: t.string,
    author: t.string,
    title: t.string,
    publisher: t.string,
    coverImg: t.string,
    languageBank: t.string,
})

export const CourseMaterialSyncEventData = t.type({
    userId: t.string,
    classId: t.string,
    isInternal: t.boolean,
    acquiredLanguageBooster: t.boolean,
    CourseMaterials: t.array(materialArray)
})

const CourseMaterialSyncEventType = t.type({
    id: t.string,
    type: t.literal("COURSE_MATERIALS"),
    data: CourseMaterialSyncEventData,
});

const UserDataType = t.type({
    id: t.string,
    name: t.string,
    macId: t.union([t.string, t.null]),
    macPass: t.union([t.string, t.null]),
});

export const StudentEnrollmentSyncEventData = t.type({
    user: UserDataType,
    ClassId: t.string,
});

const StudentEnrollmentSyncEventType = t.type({
    id: t.string,
    type: t.literal('STUDENT_ENROLLMENT'),
    data: StudentEnrollmentSyncEventData,
});

export const UserRolesUpdateSyncEventData = t.type({
    userId: t.string,
    rolesId: t.array(t.union([
        t.literal(1),
        t.literal(2),
        t.literal(3),
        t.literal(4),
        t.literal(5),
        t.literal(6),
        t.undefined
    ])),
});

const UserRolesUpdateSyncEventType = t.type({
    id: t.string,
    type: t.literal("USER_ROLES_UPDATE"),
    data: UserRolesUpdateSyncEventData,
});

export const StudentClassTransferSyncEventData = t.type({
    userId: t.string,
    oldClassId: t.string,
    newClassId: t.string,
});

const StudentClassTransferSyncEventType = t.type({
    id: t.string,
    type: t.literal('STUDENT_CLASS_TRANSFER'),
    data: StudentClassTransferSyncEventData,
});

export const StudentEnrollmentCancellationSyncEventData = t.type({
    userId: t.string,
    classId: t.string,
});

const StudentEnrollmentCancellationSyncEventType = t.type({
    id: t.string,
    type: t.literal('STUDENT_ENROLLMENT_CANCELLATION'),
    data: StudentEnrollmentCancellationSyncEventData,
});

export const StudentActivityTimerCancellationSyncEventData = t.type({
    userId: t.string,
    classId: t.string,
});

const StudentActivityTimerCancellationSyncEventType = t.type({
    id: t.string,
    type: t.literal("STUDENT_ACTIVITY_TIMER_CANCELLATION"),
    data: StudentActivityTimerCancellationSyncEventData,
});

const WebhookEventType = t.union([
    ClassSyncEventType,
    CarrerSyncEventType,
    LevelCodeSyncEventType,
    StudentUpdateSyncEventType,
    CourseMaterialSyncEventType,
    UserRolesUpdateSyncEventType,
    StudentEnrollmentSyncEventType,
    StudentClassTransferSyncEventType,
    StudentEnrollmentCancellationSyncEventType,
    StudentActivityTimerCancellationSyncEventType,
]);

export const webhookEventsController = (
    db: DatabaseService,
    readonlyDatabase: DatabaseService,
    redis?: Redis
) => async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
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
            case 'CLASS_SYNC': {
                response = await processClassSync(db, readonlyDatabase, request.log, redis)(body);
                break;
            }
            case 'CARRER_SYNC': {
                response = await processCarrerSync(db, request.log)(body);
                break;
            }
            case 'LEVEL_CODE_SYNC': {
                response = await processLevelCodeSync(db, request.log)(body);
                break;
            }
            case 'STUDENT_UPDATE': {
                response = await processStudentUpdateSync(db, request.log)(body);
                break;
            }
            case 'COURSE_MATERIALS': {
                response = await processCourseMaterialSync(db, readonlyDatabase, request.log)(body);
                break;
            }
            case 'USER_ROLES_UPDATE': {
                response = await processUserRolesUpdateSync(db, request.log)(body);
                break;
            }
            case 'STUDENT_ENROLLMENT': {
                response = await processStudentEnrollmentSync(db, request.log)(body);
                break;
            }
            case 'STUDENT_CLASS_TRANSFER': {
                response = await processStudentClassTransferSync(db, request.log, redis)(body);
                break;
            }
            case 'STUDENT_ENROLLMENT_CANCELLATION': {
                response = await processStudentEnrollmentCancellationSync(db, request.log)(body);
                break;
            }
            case 'STUDENT_ACTIVITY_TIMER_CANCELLATION': {
                response = await processStudentActivityTimerCancellationSync(db, request.log)(body);
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
        request.log.info(body, `response generated to webhook request of id ${body.id} with response ${response} loggerId ${loggerId}`);
    } catch (error: any) {
        const webhookResponse: WebhookErrorResponse = {
            success: false,
            message: error.message || 'Unexpected error',
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
