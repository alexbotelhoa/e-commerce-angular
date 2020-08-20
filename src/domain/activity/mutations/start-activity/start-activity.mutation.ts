import { GQLMutationResolvers, GQLStartActivityResultResolvers } from "../../../../resolvers-types";
import { SimpleError } from "../../../../shared/types/errors/simple-error.type";
import { selectActivityTimer, insertActivityTimer, getActivityTimerById } from "../../../../shared/repositories/activity-timer.repository";

export const startActivityMutationResolver: GQLMutationResolvers['startActivity'] =
    async (obj, { data }, context) => {
        const user = context.currentUser;
        if (!user) {
            const error: SimpleError = {
                message: 'You are not authenticated.',
                type: 'SimpleError',
            };
            return error;
        }

        const savedActivityTimer = await selectActivityTimer(context.database)
            .andWhere('cycleActivityId', data.cycleActivityId)
            .andWhere('userId', user.id)
            .andWhere('classId', data.classId)
            .first();
        if (savedActivityTimer) {
            return savedActivityTimer;
        }

        const insertedActivityId = await insertActivityTimer(context.database)({
            classId: parseInt(data.classId, 10),
            completed: false,
            completionTime: null,
            cycleActivityId: parseInt(data.cycleActivityId, 10),
            userId: user.id,
        });

        return (await getActivityTimerById(context.database)(insertedActivityId))!;

    }

export const startActivityResultResolver: GQLStartActivityResultResolvers = {
    __resolveType: (obj) => {
        if ('type' in obj) {
            return obj.type;
        }
        return 'ActivityTimer';
    }
}
