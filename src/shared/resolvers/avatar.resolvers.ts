import { GQLAvatarResolvers } from "../../resolvers-types";
import { AvatarEntity } from "../../entities/avatar.entity";

export const avatarEntityResolvers: Pick<GQLAvatarResolvers, keyof AvatarEntity> = {
    id: obj => obj.id.toString(10),
    name: obj => obj.name,
    extension: obj => obj.extension,
}

export const avatarResolvers: GQLAvatarResolvers = {
    ...avatarEntityResolvers,
    thumbnailUrl: (obj) => `assets/avatar/thumbnail/${obj.id}.${obj.extension}`,
    listUrl: obj => `assets/avatar/list/${obj.id}.${obj.extension}`,
}
