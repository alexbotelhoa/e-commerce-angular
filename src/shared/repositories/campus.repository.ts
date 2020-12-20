

import { createRepository } from "../services/repository.service";
import { CAMPUS_TABLE, CampusEntity } from "../../entities/CAMPUS.entity";

export const {
    getById: getCampusById,
    getManyByIds: getCampusByIds,
    insert: insertCampus,
    select: selectCampus,
    update: updateCampus,
    delete: deleteCampus,
    deleteAll: deleteAllCampus,
    count: countCampus,
} = createRepository<CampusEntity>(CAMPUS_TABLE, 'id');
