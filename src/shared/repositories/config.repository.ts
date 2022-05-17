import { createRepository } from "../services/repository.service";
import { ConfigEntity, CONFIG_TABLE } from "../../entities/config.entity";

export const {
    getById: getConfigById,
    getManyByIds: getConfigsByIds,
    select: selectConfig,
    insert: insertConfig,
    update: updateConfig,
    delete: deleteConfig,
    deleteAll: deleteAllConfigs,
    count: countConfigs,
} = createRepository<ConfigEntity>(CONFIG_TABLE, 'id');
