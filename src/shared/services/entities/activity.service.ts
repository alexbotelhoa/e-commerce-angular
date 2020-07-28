import { DatabaseService } from "../database.service";
import { getOneOrFail } from "../../utils/get-one-or-null.util";
import { ActivityEntity, ACTIVITY_TABLE } from "../../../entities/activity.entity"
import { HTML_ACTIVITY_DATA_TABLE } from "../../../entities/activities/html-activity-data.entity"
import { EMBEDDED_ACTIVITY_DATA_TABLE } from "../../../entities/activities/embedded-activity-data.entity"
import { ActivityTypeId } from "../../../domain/activity/enums/activity-type.enum"

interface ActivityInput extends ActivityEntity {
    content: string;
}

const createActivityAndData = async (db: DatabaseService, singleData: Partial<ActivityInput>) => {
    const { HTML, EMBEDDED } = ActivityTypeId,
        { name, description, typeId, active, content } = singleData,
        activityId = await db.insert({ name, description, typeId, active }).into(ACTIVITY_TABLE).then(getOneOrFail);

    if (singleData.typeId === HTML) {
        await db.insert({ html: content, activityId }).into(HTML_ACTIVITY_DATA_TABLE).then(getOneOrFail)
    } else if (singleData.typeId === EMBEDDED) {
        await db.insert({ url: content, activityId }).into(EMBEDDED_ACTIVITY_DATA_TABLE).then(getOneOrFail)
    } else {
        throw new TypeError("Unexpected 'typeId' given!")
    }

    return activityId
}

export const insert =
    (db: DatabaseService) =>
        async (data: Partial<ActivityInput> | Array<Partial<ActivityInput>>): Promise<number[]> => {

            if (data instanceof Array) {
                const idList = []

                for (const activity of data) {
                    idList.push(await createActivityAndData(db, activity))
                }

                return idList
            } else {
                return [await createActivityAndData(db, data)]
            }
        }