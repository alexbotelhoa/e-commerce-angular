

import { LogEntity } from "../../entities/log.entity";
import { GQLLogResolvers } from "../../resolvers-types";

export const logEntityResolvers: Pick<GQLLogResolvers, keyof LogEntity> = {
    id: obj => obj.id,
    body: obj => obj.body,
    key: obj => obj.key,
    createdAt: obj => obj.createdAt && new Date(obj.createdAt).toLocaleString("pt-BR"),
    status: obj => obj.status,
}


export const logResolver: GQLLogResolvers = {
    ...logEntityResolvers,
}
