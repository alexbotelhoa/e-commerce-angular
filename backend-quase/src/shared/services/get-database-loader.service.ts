import { DatabaseService } from "./database.service"
import { DatabaseLoaderFactory } from "../types/database-loader.type"
import DataLoader from 'dataloader';

/**
 * Service to generate database-based dataloader from DatabaseLoaderFactory functions
 * @param db 
 */
export const getDatabaseLoaderFactory = (db: DatabaseService) => {
    // internal cache for dataloaders by a calculated cache key
    const cache: Record<string, DataLoader<any, any, any> | undefined> = {};

    return <P = any>(dbLoaderFactory: DatabaseLoaderFactory<any, any, any, P>, params: P) => {
        const cacheObject = {
            id: dbLoaderFactory.id,
            params: params,
        };
        const cacheKey = JSON.stringify(cacheObject);
        // check if already cached by using the calculated cache key
        const cached = cache[cacheKey];
        if (cached) {
            return cached;
        }
        // not cached, create from factory, cache and return it
        const loaderImpl = dbLoaderFactory.batchFn;
        const dataLoader = new DataLoader(loaderImpl(db, params), dbLoaderFactory.options);
        cache[cacheKey] = dataLoader;
        return dataLoader;
    }
}

