import { GQLUserInterestResolvers } from "../../resolvers-types";
import { getInterestById } from "../repositories/interest.repository";
import { UserInterestEntity } from "../../entities/user-interest.entity";

const interestEntityResolvers: Pick<GQLUserInterestResolvers, keyof UserInterestEntity> = {
    id: obj => obj.id.toString(),
    order: obj => obj.order,
    interestId: obj => obj.interestId,
    userId: obj => obj.userId,
}

export const userInterestResolvers: GQLUserInterestResolvers = {
    ...interestEntityResolvers,
    interest: async (obj, params, context) => (await getInterestById(context.database)(obj.interestId))!,
}
