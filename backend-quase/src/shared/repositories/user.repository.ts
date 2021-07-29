import { createRepository } from "../services/repository.service";
import { UserEntity, USER_TABLE } from "../../entities/user.entity";

export const {
    getById: getUserById,
    select: selectUser,
    insert: insertUser,
    update: updateUser,
    delete: deleteUser,
    deleteAll: deleteAllUsers,
} = createRepository<UserEntity>(USER_TABLE, 'id');
