import { createRepository } from "../services/repository.service";
import { InterestEntity, INTEREST_TABLE } from "../../entities/interest.entity";

export const {
    getById: getInterestById,
    getManyByIds: getInterestesByIds,
    select: selectInterest,
    insert: insertInterest,
    update: updateInterest,
    delete: deleteInterest,
    deleteAll: deleteAllInterestes,
    count: countInterests,
} = createRepository<InterestEntity>(INTEREST_TABLE, 'id');
