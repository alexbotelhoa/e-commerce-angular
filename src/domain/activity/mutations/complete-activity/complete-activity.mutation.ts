import { GQLMutationResolvers, GQLCompleteActivityResultResolvers } from "../../../../resolvers-types";
import { SimpleError } from "../../../../shared/types/errors/simple-error.type";
import { selectActivityTimer, updateActivityTimer, getActivityTimerById, insertActivityTimer } from "../../../../shared/repositories/activity-timer.repository";

export const completeActivityMutationResolver: GQLMutationResolvers['completeActivity']
    = async (obj, { data }, context) => {
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
            if (savedActivityTimer.completed) {
                // user has already completed the activity, lets just return it as is
                return savedActivityTimer;
            }
            // otherwise we just update the completion fields
            await updateActivityTimer(context.database)({
                completed: true,
                completionTime: new Date(),
            })(builder => builder.andWhere('id', savedActivityTimer.id));
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getActivityTimerById(context.database)(savedActivityTimer.id))!;
        }
        const insertedId = await insertActivityTimer(context.database)({
            classId: data.classId,
            completed: true,
            completionTime: new Date(),
            cycleActivityId: parseInt(data.cycleActivityId, 10),
            userId: user.id,
        });

        return (await getActivityTimerById(context.database)(insertedId))!;


    }

export const completeActivityResultResolver: GQLCompleteActivityResultResolvers = {
    __resolveType: (obj) => {
        if ('type' in obj) {
            return obj.type;
        }
        return 'ActivityTimer';
    }
}
