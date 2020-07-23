import { EmbeddedActivityDataEntity } from "../../../../../entities/activities/embedded-activity-data.entity";
import { DatabaseService } from "../../../../../shared/services/database.service";
import { getEmbeddedActivitiesDataByIds } from "../../../../../shared/repositories/embedded-activity-data.repository";
import { GQLEmbeddedActivityResolvers } from "../../../../../resolvers-types";
import { DatabaseLoaderFactory } from "../../../../../shared/types/database-loader.type";
import { createDataloaderSingleSort } from "../../../../../shared/utils/dataloader-single-sort";

const embeddedActivityDataLoaderSorter = createDataloaderSingleSort<EmbeddedActivityDataEntity, number, EmbeddedActivityDataEntity>('activityId');

const embeddedActivityDataLoaderFactory: DatabaseLoaderFactory<EmbeddedActivityDataEntity['activityId'], EmbeddedActivityDataEntity> =
    (db: DatabaseService) => ({
        batchFn: async (ids) => {
            const result = await getEmbeddedActivitiesDataByIds(db)(ids);
            const sorter = embeddedActivityDataLoaderSorter(ids);
            return sorter(result);
        },
    });

export const embeddedActivityDataResolver: GQLEmbeddedActivityResolvers['data'] = (obj, params, context) => {
    const dataLoader = context.getDatabaseLoader(embeddedActivityDataLoaderFactory)
    return dataLoader.load(obj.id);
}
