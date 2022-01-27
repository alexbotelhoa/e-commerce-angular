import { FastifyLoggerInstance } from "fastify";
import { WebhookResponse } from "../types/webhook-events.types";
import { DatabaseService } from "../../../shared/services/database.service";
import { getUserById, updateUser } from "../../../shared/repositories/user.repository";

interface StudentUpdateBody {
    id: string;
    type: "STUDENT_UPDATE";
    data: {
        userId: string;
        name: string | null | undefined;
        macId: string | null | undefined;
        macPass: string | null | undefined;
        accountId: string | null | undefined;
    };
}

export const processStudentUpdateEvent = (
    db: DatabaseService,
    log: FastifyLoggerInstance
) => async (event: StudentUpdateBody): Promise<WebhookResponse> => {
    const user = await getUserById(db)(event.data.userId)
    if (!user) throw new Error("User dont found.")
    
    if (event.data.accountId) {
        await updateUser(db)({ accountId: event.data.accountId })(qb => qb.where("id", user.id))
    }
    if (event.data.macId) {
        await updateUser(db)({ macId: event.data.macId })(qb => qb.where("id", user.id))
    }
    if (event.data.macPass) {
        await updateUser(db)({ macPass: event.data.macPass })(qb => qb.where("id", user.id))
    }
    if (event.data.name) {
        await updateUser(db)({ name: event.data.name })(qb => qb.where("id", user.id))
    }

    return {
        success: true,
    }
}
