

import { CountEntity } from "../../entities/count.entity";
import { GQLCountResolvers } from "../../resolvers-types";

export const CountEntityResolvers: Pick<GQLCountResolvers, keyof CountEntity> = {
    id: obj => obj.id,
    name: obj => obj.name,
    count: obj => obj.count
}


export const countResolver: GQLCountResolvers = {
    ...CountEntityResolvers,
}