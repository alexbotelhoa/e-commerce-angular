import { FastifyLoggerInstance } from "fastify";
import { DatabaseService } from "../../../shared/services/database.service";
import { getClassById } from "../../../shared/repositories/class.repository";
import { WebhookResponse, StudentActivityTimerCancellationEvent } from "../types/webhook-events.types";
import { deleteActivityTimer, selectActivityTimer } from "../../../shared/repositories/activity-timer.repository";

export interface StudentActivityTimerCancellationData {
    userId: string;
    classId: string;
}

export const processStudentActivityTimerCancellation = (db: DatabaseService, log: FastifyLoggerInstance) =>
    async (event: StudentActivityTimerCancellationEvent): Promise<WebhookResponse> => {
        const data = event.data;
        const existingClass = await getClassById(db)(data.classId);

        if (!existingClass) {
            log.info(
                event as any,
                "Class is not yet registered."
            );
            return {
                success: false,
                message: "Class is not yet registered.",
            };
        }

        const [exitingActivities] = await selectActivityTimer(db)
            .andWhere("userId", data.userId)
            .andWhere("classId", data.classId);

        if (!exitingActivities) {
            log.info(
                event as any,
                "User is not activity completed in this class, so there is nothing to do, exiting."
            );
            return {
                success: false,
                message: "User is not activity completed in this class, so there is nothing to do, exiting.",
            };
        }

        log.info(
            event as any,
            'Processing activity completed cancellation, found enrollment class for user, removing'
        );
        await db.transaction(async trx => {
            await deleteActivityTimer(trx)(where => where.andWhere("userId", data.userId).andWhere("classId", data.classId));
        })

        return {
            success: true,
        }
    }
