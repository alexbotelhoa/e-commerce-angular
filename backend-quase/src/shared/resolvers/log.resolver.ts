import { GQLLogResolvers } from "../../resolvers-types";
import { LogEntity } from "../../entities/log.entity";

const logEntityResolvers: Pick<GQLLogResolvers, keyof LogEntity> = {
    id: obj => obj.id.toString(),
    body: obj => obj.body,
    key: obj => obj.key,
    createdAt: obj => obj.createdAt,
}

export const logResolver: GQLLogResolvers = {
    ...logEntityResolvers,
}
