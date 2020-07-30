import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getActivityById, insertActivity, updateActivity } from "../../../../shared/repositories/activity.repository";

import { ActivityTypeId } from "../../enums/activity-type.enum"

import { EMBEDDED_ACTIVITY_DATA_TABLE } from "../../../../entities/activities/embedded-activity-data.entity"
import { HTML_ACTIVITY_DATA_TABLE } from "../../../../entities/activities/html-activity-data.entity"


export const createActivityMutationResolver: GQLMutationResolvers['createActivity'] = async (obj, { data: activityData }, { database: db }) => {

    if (!activityData) {
        throw new Error('Invalid argument!')
    }

    const { HTML } = ActivityTypeId,
        { data, ...activityInfo } = activityData,
        { name, description, active, typeId } = activityInfo,
        activityId = await insertActivity(db)({ name, description, active: active || undefined, typeId });

    const [content, table] = typeId === HTML
        ? [{ html: data.html, activityId }, HTML_ACTIVITY_DATA_TABLE]
        : [{ url: data.url, activityId }, EMBEDDED_ACTIVITY_DATA_TABLE];

    await db.insert(content).into(table)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getActivityById(db)(activityId))!;
}

export const toggleActivityState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateActivity'] | GQLMutationResolvers['deactivateActivity'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getActivityById(db)(await updateActivity(db)(data)(builder => builder.andWhere('id', id))))!;
        }