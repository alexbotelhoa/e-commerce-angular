import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getActivityById, updateActivity } from "../../../../shared/repositories/activity.repository";
import { ActivityTypeId } from "../../enums/activity-type.enum";
import { updateEmbeddedActivityData } from "../../../../shared/repositories/embedded-activity-data.repository";

export const updateEmbeddedActivityMutationResolver: GQLMutationResolvers['updateEmbeddedActivity'] = async (obj, { data }, { database: db }) => {

    const activity = await getActivityById(db)(data.id);

    if (!activity) {
        throw new Error(`Activity with id ${data.id} not found`);
    }

    if (activity.typeId !== ActivityTypeId.EMBEDDED) {
        throw new Error(`Activity with id ${data.id} is not of type EMBEDDED`);
    }

    await db.transaction(async trx => {
        await updateActivity(trx)({
            active: data.active,
            description: data.description,
            name: data.name,
            estimatedTime: data.estimatedTime
        })(builder => builder.andWhere('id', data.id));

        await updateEmbeddedActivityData(trx)({
            url: data.data.url,
            height: data.data.height,
        })(builder => builder.andWhere('activityId', data.id));
    })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getActivityById(db)(data.id))!;
}
