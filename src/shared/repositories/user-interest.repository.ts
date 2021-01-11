import { createRepository } from "../services/repository.service";
import { UserInterestEntity, USER_INTEREST_TABLE } from "../../entities/user-interest.entity";

export const {
    getById: getUserInterestById,
    getManyByIds: getUserInterestesByIds,
    select: selectUserInterest,
    insert: insertUserInterest,
    update: updateUserInterest,
    delete: deleteUserInterest,
    deleteAll: deleteAllUserInterestes,
    count: countUserInterests,
} = createRepository<UserInterestEntity>(USER_INTEREST_TABLE, 'id');
