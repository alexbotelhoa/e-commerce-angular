

import { createRepository } from "../services/repository.service";
import { RegionalEntity, REGIONAL_TABLE } from "../../entities/regional.entity";

export const {
    getById: getRegionalById,
    getManyByIds: getRegionalsByIds,
    insert: insertRegional,
    select: selectRegional,
    update: updateRegional,
    delete: deleteRegional,
    deleteAll: deleteAllRegionals,
    count: countRegionals,
} = createRepository<RegionalEntity>(REGIONAL_TABLE, 'id');
