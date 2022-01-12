import { createRepository } from "../services/repository.service";
import { MaterialEntity, MATERIAL_TABLE } from "../../entities/material.entity";

export const {
    getById: getMaterialById,
    getManyByIds: getMaterialsByIds,
    insert: insertMaterial,
    select: selectMaterial,
    update: updateMaterial,
    delete: deleteMaterial,
    deleteAll: deleteAllMaterials,
    count: countMaterials,
} = createRepository<MaterialEntity>(MATERIAL_TABLE, 'id');
