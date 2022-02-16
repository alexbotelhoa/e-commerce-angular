import { CountEntity } from "../../entities/count.entity";
import { GQLCountResolvers } from "../../resolvers-types";

const CountEntityResolvers: Pick<GQLCountResolvers, keyof CountEntity> = {
    id: obj => obj.id,
    name: obj => obj.name,
    count: obj => obj.count
}

export const countResolvers: GQLCountResolvers = {
    ...CountEntityResolvers,
}
