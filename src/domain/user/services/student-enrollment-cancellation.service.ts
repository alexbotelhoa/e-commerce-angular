import { FastifyLoggerInstance } from "fastify";
import { getClassById } from "../../../shared/repositories/class.repository";
import { deleteEnrollmentClass, selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";
import { deleteEnrollment, selectEnrollment } from "../../../shared/repositories/enrollment.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { StudentEnrollmentCancellationEvent, WebhookResponse } from "../types/webhook-events.types";

export interface StudentEnrollmentCancellationData {
    userId: string;
    classId: string;
}

export const processStudentEnrollmentCancellation = (db: DatabaseService, log: FastifyLoggerInstance) =>
    async (event: StudentEnrollmentCancellationEvent): Promise<WebhookResponse> => {
        const data = event.data;
        const existingClass = await getClassById(db)(data.classId);

        if (!existingClass) {
            log.info(event as any, 'Class is not yet registered.')
            return {
                success: true,
            };
        }

        const [enrollment] = await selectEnrollment(db).andWhere('userId', data.userId).andWhere('levelCodeId', existingClass.levelCodeId);

        // class exists
        const allEnrollmentClasses = await selectEnrollmentClass(db).andWhere('enrollmentId', enrollment.id);
        const enrollmentClassToDelete = allEnrollmentClasses.find(enrollmentClass => enrollmentClass.classId === data.classId);

        if (enrollmentClassToDelete) {
            log.info(event as any, 'Processing enrollment cancellation, found enrollment class for user, removing');
            await db.transaction(async trx => {
                await deleteEnrollmentClass(trx)(where => where.andWhere('classId', data.classId).andWhere('enrollmentId', enrollment.id));
                if (allEnrollmentClasses.length === 1) {
                    // if the enrollment class removed is the only one, then we should also remove the enrollment of the level
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
