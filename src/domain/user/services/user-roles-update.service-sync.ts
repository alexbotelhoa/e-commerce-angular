import { FastifyLoggerInstance } from "fastify";
import { DatabaseService } from "../../../shared/services/database.service";
import { UserRolesUpdateSyncEvent, WebhookResponse } from "../types/webhook-events.types";
import { deleteUserRole, insertUserRole } from "../../../shared/repositories/user-role.repository";

export const processUserRolesUpdateSync = (
    db: DatabaseService,
    log: FastifyLoggerInstance
) => async (event: UserRolesUpdateSyncEvent): Promise<WebhookResponse> => {
    const userId = event.data.userId;
    const userData = event.data;

    await deleteUserRole(db)(builder => builder.andWhere({ userId: userId }));

    await userData.rolesId.map(role => {
        insertUserRole(db)({
            userId: userId,
            roleId: role
        })
    })

    return {
        success: true,
    }
}
