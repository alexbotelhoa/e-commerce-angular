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

    [userData.rolesId.includes(0) && !userData.rolesId.includes(1)].some(yes => yes && userData.rolesId.splice(1,0,1));

    await db.transaction(async trx => {
        await deleteUserRole(trx)(builder => builder.andWhere({ userId: userId }));
        await userData.rolesId.map(role => insertUserRole(trx)({ userId: userId, roleId: role }));
    });

    return {
        success: true,
    }
}
