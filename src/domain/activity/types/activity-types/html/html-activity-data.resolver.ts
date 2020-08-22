import { HtmlActivityDataEntity } from "../../../../../entities/activities/html-activity-data.entity";
import { getHtmlActivitiesDataByIds } from "../../../../../shared/repositories/html-activity-data.repository";
import { GQLHtmlActivityResolvers } from "../../../../../resolvers-types";
import { DatabaseLoaderFactory } from "../../../../../shared/types/database-loader.type";
import { createDataloaderSingleSort } from "../../../../../shared/utils/dataloader-single-sort";

const htmlActivityDataLoaderSorter = createDataloaderSingleSort<HtmlActivityDataEntity, number, HtmlActivityDataEntity>('activityId');

const htmlActivityDataLoaderFactory: DatabaseLoaderFactory<HtmlActivityDataEntity['activityId'], HtmlActivityDataEntity> =
{
    id: 'htmlActivityDataLoaderFactory',
    batchFn: db => async (ids) => {
        const result = await getHtmlActivitiesDataByIds(db)(ids);
        const sorter = htmlActivityDataLoaderSorter(ids);
        return sorter(result);
    },
};

export const htmlActivityDataResolver: GQLHtmlActivityResolvers['data'] = (obj, params, context) => {
    const dataLoader = context.getDatabaseLoader(htmlActivityDataLoaderFactory, undefined)
    return dataLoader.load(obj.id);
}
