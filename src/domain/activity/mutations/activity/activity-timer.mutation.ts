import { GQLMutationResolvers } from "../../../../resolvers-types";
import { deleteAllActivityTimers, selectActivityTimer } from "../../../../shared/repositories/activity-timer.repository";
import { getClassById } from "../../../../shared/repositories/class.repository";

export const deleteActivityTimerMutationResolver: GQLMutationResolvers['deleteActivityTimer'] = async (obj, { data }, context) => {
    const userId = data.userId;
    const classId = data.classId;
    const classExists = await getClassById(context.database)(classId);

    if (!classExists) {
        throw new Error('Class not found');
    }

    const [userIsInClass] = await selectActivityTimer(context.database).
                                            where("userId", userId).
                                            andWhere("classId", classId);

    if (!userIsInClass) {
        throw new Error('User not in this Class');
    }

    const deleted = await deleteAllActivityTimers(context.database).
                                    where("userId", userId).
                                    andWhere("classId", classId);
    if (deleted === null) {
        throw new Error('Error while deleting activity timers');
    }
    return true;
}