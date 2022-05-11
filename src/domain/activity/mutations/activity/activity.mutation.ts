import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getActivityById, insertActivity, updateActivity } from "../../../../shared/repositories/activity.repository";

import { ActivityTypeId } from "../../enums/activity-type.enum"

import { ActivityEntity } from "../../../../entities/activity.entity";
import { insertEmbeddedActivityData } from "../../../../shared/repositories/embedded-activity-data.repository";
import { insertHtmlActivityData } from "../../../../shared/repositories/html-activity-data.repository";

export const createEmbeddedActivityMutationResolver: GQLMutationResolvers['createEmbeddedActivity'] = async (obj, { data }, { database: db }) => {

    const embeddedActivity: Omit<ActivityEntity, 'id'> = {
        active: data.active,
        description: data.description,
        name: data.name,
        typeId: ActivityTypeId.EMBEDDED,
        estimatedTime: data.estimatedTime
    };

    const insertedId = await db.transaction(async trx => {
        const id = await insertActivity(trx)(embeddedActivity);
        await insertEmbeddedActivityData(trx)({
            activityId: id,
            url: data.data.url,
            height: data.data.height,
            externalSite: data.data.externalSite,
        });
        return id;
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getActivityById(db)(insertedId))!;
}

export const createHtmlActivityMutationResolver: GQLMutationResolvers['createHtmlActivity'] = async (obj, { data }, { database: db }) => {

    const embeddedActivity: Omit<ActivityEntity, 'id'> = {
        active: data.active,
        description: data.description,
        name: data.name,
        typeId: ActivityTypeId.HTML,
        estimatedTime: data.estimatedTime
    };

    const insertedId = await db.transaction(async trx => {
        const id = await insertActivity(trx)(embeddedActivity);
        await insertHtmlActivityData(trx)({
            activityId: id,
            html: data.data.html,
        });
        return id;
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getActivityById(db)(insertedId))!;
}

export const toggleActivityState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateActivity'] | GQLMutationResolvers['deactivateActivity'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            await updateActivity(db)(data)(builder => builder.andWhere('id', parseInt(id)))
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getActivityById(db)(id))!;
        }
