

import { createRepository } from "../services/repository.service";
import { LocalEntity, LOCAL_TABLE } from "../../entities/local.entity";

export const {
    getById: getLocalById,
    getManyByIds: getLocalsByIds,
    insert: insertLocal,
    select: selectLocal,
    update: updateLocal,
    delete: deleteLocal,
    deleteAll: deleteAllLocals,
    count: countLocals,
} = createRepository<LocalEntity>(LOCAL_TABLE, 'id');
