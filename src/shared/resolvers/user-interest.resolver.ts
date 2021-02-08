import { GQLUserInterestResolvers } from "../../resolvers-types";
import { UserInterestEntity } from "../../entities/user-interest.entity";
import { getInterestById } from "../repositories/interest.repository";

export const interestEntityResolvers: Pick<GQLUserInterestResolvers, keyof UserInterestEntity> = {
    id: obj => obj.id.toString(),
    order: obj => obj.order,
    interestId: obj => obj.interestId,
    userId: obj => obj.userId,
}


export const userInterestResolvers: GQLUserInterestResolvers = {
    ...interestEntityResolvers,
    interest: async (obj, params, context) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (await getInterestById(context.database)(obj.interestId))!
    },

}
