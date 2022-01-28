import { FastifyLoggerInstance } from "fastify";
import { MaterialEntity } from "../../../entities/material.entity";
import { getUserById } from "../../../shared/repositories/user.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { getClassById } from "../../../shared/repositories/class.repository";
import { CourseMaterialSyncEvent, WebhookResponse } from "../types/webhook-events.types";
import { insertMaterial, selectMaterial, updateMaterial } from "../../../shared/repositories/material.repository";

export const processCourseMaterialSync = (
    db: DatabaseService,
    readonlyDatabase: DatabaseService,
    log: FastifyLoggerInstance
) => async (event: CourseMaterialSyncEvent): Promise<WebhookResponse> => {
    const materialData = event.data;
    const userId = materialData.userId;
    const user = await getUserById(db)(userId);
    if (!user) {
        return {
            message: "User Don't found.",
            success: false,
        };
    }

    const classFound = await getClassById(db)(materialData.classId);
    if (!classFound) {
        return {
            message: "class must already be synced.",
            success: false,
        };
    }

    const baseMaterialInfo: Partial<MaterialEntity> = {
        userId,
        active: true,
        classId: materialData.classId,
        isInternal: materialData.isInternal,            
        acquiredLanguageBooster: materialData.acquiredLanguageBooster,
    }

    materialData.CourseMaterials.forEach(async (material: any) => {
        const [hasMaterial] = await selectMaterial(readonlyDatabase).where("userId", "=", userId)
        .andWhere("isbn", "=", material.isbn).andWhere("classId", "=", materialData.classId);
        if (hasMaterial) {
            await updateMaterial(db)({
                ...baseMaterialInfo,
                updatedAt: new Date().toLocaleString("en-US", {
                    timeZone: "America/Sao_Paulo"
                }),
                isbn: material.isbn,
                title: material.title,
                contextId: material.id,
                author: material.author,
                coverImg: material.coverImg,
                publisher: material.publisher,
                languageBank: material.languageBank,
            })(qb => qb.where("id", hasMaterial.id))
        } else {
            await insertMaterial(db)({
                ...baseMaterialInfo,
                updatedAt: new Date().toLocaleString(undefined, {
                    timeZone: "America/Sao_Paulo"
                }),
                isbn: material.isbn,
                title: material.title,
                contextId: material.id,
                author: material.author,
                coverImg: material.coverImg,
                publisher: material.publisher,
                languageBank: material.languageBank,
            })
        }
    });

    const studentMaterials = await selectMaterial(readonlyDatabase)
        .where("userId", "=", userId)
        .andWhere("classId", "=", materialData.classId);

    const activeIds = studentMaterials.filter(m => materialData.CourseMaterials.some((item: any) => item.isbn === m.isbn)).map(i => i.id);
    if (studentMaterials.length > 0 ) {
        if (activeIds.length > 0) {
            await updateMaterial(db)({ active: false })(qb => qb.where("userId", userId).andWhere("classId", "=", materialData.classId).whereNotIn("id", activeIds))
        } else {
            await updateMaterial(db)({ active: false })(qb => qb.where("userId", userId).andWhere("classId", "=", materialData.classId));
        }
    }

    return {
        success: true,
    }
}
