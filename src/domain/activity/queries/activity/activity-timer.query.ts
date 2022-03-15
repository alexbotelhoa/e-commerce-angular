import { GQLQueryResolvers } from "../../../../resolvers-types";

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
        result = await context.database.
                                select(['aT.userId', 'aT.classId']).
                                distinct().
                                from('activity_timer as aT').
                                where('aT.userId', userId).
                                andWhere('aT.classId', classId).
                                andWhere('aT.completed', 1);
        result = result[0];
    }
    return result;
}
