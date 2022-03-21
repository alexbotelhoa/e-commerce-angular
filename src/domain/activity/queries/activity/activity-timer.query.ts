import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectActivityTimer } from "../../../../shared/repositories/activity-timer.repository";

export const activityTimerQueryResolver: GQLQueryResolvers['activityTimer'] = async (obj, { data }, context) => {
    let result = null;
    if (data) {
        const userId = data.userId;
        const classId = data.classId;

        if (!userId) {
            throw new Error('User not found');
        }
        if (!classId) {
            throw new Error('Class not found');
        }

        result = await selectActivityTimer(context.readonlyDatabase)
            .distinct()    
            .where('userId', userId)
            .andWhere('completed', true)
            .andWhere('classId', classId);

        return result[0];
    }

    return result;
}
