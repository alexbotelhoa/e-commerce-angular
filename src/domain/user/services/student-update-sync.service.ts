import { FastifyLoggerInstance } from "fastify";
import { DatabaseService } from "../../../shared/services/database.service";
import { getUserById, updateUser } from "../../../shared/repositories/user.repository";
import { StudentUpdateSyncEvent, WebhookResponse } from "../types/webhook-events.types";

export const processStudentUpdateSync = (
    db: DatabaseService,
    log: FastifyLoggerInstance
) => async (event: StudentUpdateSyncEvent): Promise<WebhookResponse> => {
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
