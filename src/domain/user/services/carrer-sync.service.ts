import { FastifyLoggerInstance } from "fastify";
import { PermissionEntity } from "../../../entities/permission.entity";
import { insertPermission, selectPermission, updatePermission } from "../../../shared/repositories/carrer-permission-repository";
import { insertCarrer, selectCarrer, updateCarrer } from "../../../shared/repositories/carrer.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { getOneOrNull } from "../../../shared/utils/get-one-or-null.util";
import { CarrerSyncEvent, WebhookResponse } from "../types/webhook-events.types";

export const processCarrerSync =
    (db: DatabaseService, log: FastifyLoggerInstance) => async (event: CarrerSyncEvent): Promise<WebhookResponse> => {
        const carrers = event.data
        for (const carrer of carrers) {
            if (carrer.roles && carrer.roles.length === 0) {
                await updatePermission(db)({ active: false, updatedAt: db.fn.now() as any })(qb => qb.where("carrerId", carrer.carrer))
                await updateCarrer(db)({ active: false, updatedAt: db.fn.now() as any })(qb => qb.where("carrerId", carrer.carrer))
            } else {
                const dbCarrer = getOneOrNull(await selectCarrer(db).where("carrerId", carrer.carrer))
                if (!dbCarrer) {
                    const idCarrer = await insertCarrer(db)({
                        active: true,
                        carrerId: carrer.carrer,
                    })
                    const permissions: Partial<PermissionEntity>[] = mapPermissionsByRoles(carrer.roles, idCarrer, carrer.carrer)
                    await insertPermission(db)(permissions)
                    const rolesToActivate = carrer.roles;
                    await updatePermission(db)({ active: false, updatedAt: db.fn.now() as any })(qb => qb.whereNotIn("name", rolesToActivate).andWhere("carrerId", carrer.carrer))

                } else {
                    const permissions: Partial<PermissionEntity>[] = mapPermissionsByRoles(carrer.roles, parseFloat(dbCarrer.id), carrer.carrer)
                    // const rolesToActivate = carrer.roles;
                    for (const permission of permissions) {
                        const permissionDb: PermissionEntity | null = getOneOrNull(await selectPermission(db).where("carrerId", carrer.carrer).andWhere("name", permission.name))
                        if (!permissionDb) {
                            await insertPermission(db)(permission)
                        }
                    }
                    const rolesToDisable = carrer.roles;
                    await updatePermission(db)({ active: false, updatedAt: db.fn.now() as any })(qb => qb.whereNotIn("name", rolesToDisable).andWhere("carrerId", carrer.carrer))
                }
            }
        }

        return {
            success: true,
        }
    }


function mapPermissionsByRoles(roles: string[], idCarrer: number, carrerName: string) {
    const permissions: Partial<PermissionEntity>[] = roles.map(item => {
        return {
            carrer: idCarrer.toString(),
            carrerId: carrerName,
            name: item,
        }
    })
    return permissions;
}