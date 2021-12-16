import { FastifyLoggerInstance } from "fastify";
import { MaterialEntity } from "../../../entities/material.entity";
import { getClassById } from "../../../shared/repositories/class.repository";
import { insertMaterial, selectMaterial, updateMaterial } from "../../../shared/repositories/material.repository";
import { getUserById } from "../../../shared/repositories/user.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { StudentMaterialEvent, WebhookResponse } from "../types/webhook-events.types";

export const processStudentMaterialEvent =
    (db: DatabaseService, readonlyDatabase: DatabaseService, log: FastifyLoggerInstance) => async (event: StudentMaterialEvent): Promise<WebhookResponse> => {
        const materialData = event.data;
        const userId = materialData.userId;
        const user = await getUserById(db)(userId)
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
            languageBank: materialData.languageBank,
            acquiredLanguageBooster: materialData.acquiredLanguageBooster == 'true' ? true : false,
        }
        materialData.CourseMaterials.forEach(async material => {
            const [hasMaterial] = await selectMaterial(readonlyDatabase).where("userId", "=", userId)
            .andWhere("isbn", "=", material.isbn).andWhere("classId", "=", materialData.classId);
            if (hasMaterial) {
                await updateMaterial(db)({
                    ...baseMaterialInfo,
                    updatedAt: new Date().toLocaleString("en-US", {
                        timeZone: "America/Sao_Paulo"
                    }),
                    author: material.author,
                    coverImg: material.coverImg,
                    isbn: material.isbn,
                    title: material.title,
                    publisher: material.publisher,
                })(qb => qb.where("id", hasMaterial.id))
            } else {
                await insertMaterial(db)({
                    ...baseMaterialInfo,
                    updatedAt: new Date().toLocaleString(undefined, {
                        timeZone: "America/Sao_Paulo"
                    }),
                    author: material.author,
                    coverImg: material.coverImg,
                    isbn: material.isbn,
                    title: material.title,
                    publisher: material.publisher,
                })
            }
        });
        const studentMaterials = await selectMaterial(readonlyDatabase).where("userId", "=", userId)
        .andWhere("classId", "=", materialData.classId);
        const activeIds = studentMaterials.filter(m => materialData.CourseMaterials.some(item => item.isbn === m.isbn)).map(i => i.id)
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

