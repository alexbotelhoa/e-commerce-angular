import { FastifyLoggerInstance } from "fastify";
import { DatabaseService } from "../../../shared/services/database.service";
import { getClassById } from "../../../shared/repositories/class.repository";
import { deleteEnrollment, selectEnrollment } from "../../../shared/repositories/enrollment.repository";
import { StudentEnrollmentCancellationSyncEvent, WebhookResponse } from "../types/webhook-events.types";
import { deleteEnrollmentClass, selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";

export const processStudentEnrollmentCancellationSync = (
    db: DatabaseService,
    log: FastifyLoggerInstance
) => async (event: StudentEnrollmentCancellationSyncEvent): Promise<WebhookResponse> => {
    const data = event.data;
    const existingClass = await getClassById(db)(data.classId);

    if (!existingClass) {
        log.info(event as any, 'Class is not yet registered.')
        return {
            success: false,
            message: 'Class is not yet registered.'
        };
    }

    const [enrollment] = await selectEnrollment(db).andWhere('userId', data.userId).andWhere('levelCodeId', existingClass.levelCodeId);

    if (!enrollment) {
        log.info(event as any, 'User is not enrolled in this level code, so there is nothing to do, exiting.');
        return {
            success: false,
            message: 'User is not enrolled in this level code, so there is nothing to do, exiting.'
        }
    }

    const allEnrollmentClasses = await selectEnrollmentClass(db).andWhere('enrollmentId', enrollment.id);
    const enrollmentClassToDelete = allEnrollmentClasses.find(enrollmentClass => enrollmentClass.classId === data.classId);

    if (enrollmentClassToDelete) {
        log.info(event as any, 'Processing enrollment cancellation, found enrollment class for user, removing');
        await db.transaction(async trx => {
            await deleteEnrollmentClass(trx)(where => where.andWhere('classId', data.classId).andWhere('enrollmentId', enrollment.id));
            if (allEnrollmentClasses.length === 1) {
                await deleteEnrollment(trx)(where => where.andWhere('id', enrollment.id));
            }
        })
    } else {
        log.info(event as any, 'Processing enrollment cancellation, enrollment class for user not found, nothing to do');
    }

    return {
        success: true,
    }
}
