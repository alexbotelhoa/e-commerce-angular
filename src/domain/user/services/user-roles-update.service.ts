import { FastifyLoggerInstance } from "fastify";
import { RoleId } from "../../../resolvers-types";
import { WebhookResponse } from "../types/webhook-events.types";
import { DatabaseService } from "../../../shared/services/database.service";
import { deleteUserRole, insertUserRole } from "../../../shared/repositories/user-role.repository";

interface UserRolesUpdateBody {
    id: string;
    type: "USER_ROLES_UPDATE";
    data: {
        userId: string;
        rolesId: (RoleId | undefined)[];
    };
}

export const processUserRolesUpdateEvent = (
    db: DatabaseService,
    log: FastifyLoggerInstance
) => async (event: UserRolesUpdateBody): Promise<WebhookResponse> => {
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
