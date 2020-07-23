import { HtmlActivityDataEntity } from "../../../../../entities/activities/html-activity-data.entity";
import { DatabaseService } from "../../../../../shared/services/database.service";
import { getHtmlActivitiesDataByIds } from "../../../../../shared/repositories/html-activity-data.repository";
import { GQLHtmlActivityResolvers } from "../../../../../resolvers-types";
import { DatabaseLoaderFactory } from "../../../../../shared/types/database-loader.type";
import { createDataloaderSingleSort } from "../../../../../shared/utils/dataloader-single-sort";

const htmlActivityDataLoaderSorter = createDataloaderSingleSort<HtmlActivityDataEntity, number, HtmlActivityDataEntity>('activityId');

const htmlActivityDataLoaderFactory: DatabaseLoaderFactory<HtmlActivityDataEntity['activityId'], HtmlActivityDataEntity> =
    (db: DatabaseService) => ({
        batchFn: async (ids) => {
            const result = await getHtmlActivitiesDataByIds(db)(ids);
            const sorter = htmlActivityDataLoaderSorter(ids);
            return sorter(result);
        },
    });

export const htmlActivityDataResolver: GQLHtmlActivityResolvers['data'] = (obj, params, context) => {
    const dataLoader = context.getDatabaseLoader(htmlActivityDataLoaderFactory)
    return dataLoader.load(obj.id);
}
