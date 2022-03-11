import { FastifyLoggerInstance } from "fastify";

import { DatabaseService } from "../../../shared/services/database.service";
import { getUserById, updateUser } from "../../../shared/repositories/user.repository";
import { StudentUpdateSyncEvent, WebhookResponse } from "../types/webhook-events.types";

export const processStudentUpdateSync = (
    db: DatabaseService,
    log: FastifyLoggerInstance
) => async (event: StudentUpdateSyncEvent): Promise<WebhookResponse> => {
    const user = await getUserById(db)(event.data.userId);
    if (!user) throw new Error("User dont found.");
    
    if (event.data.accountId) {
        await updateUser(db)({ accountId: event.data.accountId })(builder => builder.where("id", user.id));
    }
    if (event.data.macId) {
        await updateUser(db)({ macId: event.data.macId })(builder => builder.where("id", user.id));
    }
    if (event.data.macPass) {
        await updateUser(db)({ macPass: event.data.macPass })(builder => builder.where("id", user.id));
    }
    if (event.data.name) {
        await updateUser(db)({ name: event.data.name })(builder => builder.where("id", user.id));
    }

    return {
        success: true,
    }
}
