import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getInterestById } from "../../../../shared/repositories/interest.repository";
import { deleteUserInterest, insertUserInterest, selectUserInterest } from "../../../../shared/repositories/user-interest.repository";
import { DatabaseService } from "../../../../shared/services/database.service";
import { getOneOrNull } from "../../../../shared/utils/get-one-or-null.util";

async function calculateOrderUserInterest(db: DatabaseService<any, any>, userId: string): Promise<1 | 2> {
    const userInterest = await selectUserInterest(db).where("userId", "=", userId)
    const primaryInterest = userInterest.filter(ui => ui.order === 1)
    if (primaryInterest.length >= 2) {
        return 2
    }
    return 1
}

export const upsertOrRemoteUserInterestMutationResolver: GQLMutationResolvers['upsertOrRemoveUserInterest'] = async (obj, params, context) => {

    const db = context.database;
    const user = context.currentUser;

    if (!user) {
        return null;
    }

    const hasUserInterest = getOneOrNull(await selectUserInterest(db).where("userId", "=", user.id)
        .andWhere("interestId", "=", params.data.interestId))
    if (hasUserInterest) {
        await deleteUserInterest(db)(builder => builder.andWhere("userId", "=", user.id)
            .andWhere("interestId", "=", params.data.interestId));
    } else {
        const order = await calculateOrderUserInterest(db, user.id)
        await insertUserInterest(db)({
            interestId: params.data.interestId.toString(),
            userId: user.id,
            order
        })
        return getInterestById(db)(params.data.interestId.toString())
    }
    return null;
}
