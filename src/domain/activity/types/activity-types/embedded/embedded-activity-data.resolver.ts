import { EmbeddedActivityDataEntity } from "../../../../../entities/activities/embedded-activity-data.entity";
import { getEmbeddedActivitiesDataByIds } from "../../../../../shared/repositories/embedded-activity-data.repository";
import { GQLEmbeddedActivityResolvers } from "../../../../../resolvers-types";
import { DatabaseLoaderFactory } from "../../../../../shared/types/database-loader.type";
import { createDataloaderSingleSort } from "../../../../../shared/utils/dataloader-single-sort";

const embeddedActivityDataLoaderSorter = createDataloaderSingleSort<EmbeddedActivityDataEntity, number, EmbeddedActivityDataEntity>('activityId');

const embeddedActivityDataLoaderFactory: DatabaseLoaderFactory<EmbeddedActivityDataEntity['activityId'], EmbeddedActivityDataEntity> =
{
    id: 'embeddedActivityDataLoaderFactory',
    batchFn: db => async (ids) => {
        const result = await getEmbeddedActivitiesDataByIds(db)(ids);
        const sorter = embeddedActivityDataLoaderSorter(ids);
        return sorter(result);
    },
};

export const embeddedActivityDataResolver: GQLEmbeddedActivityResolvers['data'] = (obj, params, context) => {
    const dataLoader = context.getDatabaseLoader(embeddedActivityDataLoaderFactory, undefined)
    return dataLoader.load(obj.id);
}
