import { GQLLevelCodeResolvers } from "../../resolvers-types";
import { LevelCodeEntity } from "../../entities/level-code.entity";

const levelCodeEntityResolvers: Pick<GQLLevelCodeResolvers, keyof LevelCodeEntity> = {
    id: obj => obj.id.toString(10),
    active: obj => obj.active,
    createdAt: obj => obj.createdAt,
    code: obj => obj.code,
    description: obj => obj.description,
    levelId: obj => obj.levelId
        ? obj.levelId.toString(10)
        : null,
}

export const levelCodeResolvers: GQLLevelCodeResolvers = {
    ...levelCodeEntityResolvers,
}
