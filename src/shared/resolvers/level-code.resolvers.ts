import { GQLLevelCodeResolvers } from "../../resolvers-types";
import { LevelCodeEntity } from "../../entities/level-code.entity";

const levelCodeEntityResolvers: Pick<GQLLevelCodeResolvers, keyof LevelCodeEntity> = {
    id: obj => obj.id.toString(),
    active: obj => obj.active,
    createdAt: obj => obj.createdAt,
}

export const levelCodeResolvers: GQLLevelCodeResolvers = {
    ...levelCodeEntityResolvers,
}
