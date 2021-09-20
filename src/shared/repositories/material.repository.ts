import { MATERIAL_TABLE, MaterialEntity } from "../../entities/material.entity";
import { createRepository } from "../services/repository.service";

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
