import { createRepository } from "../services/repository.service";
import { AvatarEntity, AVATAR_TABLE } from "../../entities/avatar.entity";

export const {
    getById: getAvatarById,
    getManyByIds: getAvatarsByIds,
    select: selectAvatar,
    insert: insertAvatar,
    update: updateAvatar,
    delete: deleteAvatar,
    deleteAll: deleteAllAvatars,
    count: countAvatars,
} = createRepository<AvatarEntity>(AVATAR_TABLE, 'id');
