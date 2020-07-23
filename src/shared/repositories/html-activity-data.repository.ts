import { createRepository } from "../services/repository.service";
import { HtmlActivityDataEntity, HTML_ACTIVITY_DATA_TABLE } from "../../entities/activities/html-activity-data.entity";

export const {
    getById: getHtmlActivityDataById,
    getManyByIds: getHtmlActivitiesDataByIds,
    select: selectHtmlActivityData,
    insert: insertHtmlActivityData,
    update: updateHtmlActivityData,
    delete: deleteHtmlActivityData,
    deleteAll: deleteAllHtmlActivitiesData,
} = createRepository<HtmlActivityDataEntity>(HTML_ACTIVITY_DATA_TABLE, 'activityId');
