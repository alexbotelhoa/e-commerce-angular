import DataLoader from 'dataloader';
import { DatabaseService } from "./database.service";
import { DatabaseLoaderFactory } from "../types/database-loader.type";

export const getDatabaseLoaderFactory = (db: DatabaseService) => {
    
    const cache: Record<string, DataLoader<any, any, any> | undefined> = {};

    return <P = any>(dbLoaderFactory: DatabaseLoaderFactory<any, any, any, P>, params: P) => {
        const cacheObject = {
            id: dbLoaderFactory.id,
            params: params,
        };
        const cacheKey = JSON.stringify(cacheObject);
        const cached = cache[cacheKey];
        if (cached) {
            return cached;
        }
        const loaderImpl = dbLoaderFactory.batchFn;
        const dataLoader = new DataLoader(loaderImpl(db, params), dbLoaderFactory.options);
        cache[cacheKey] = dataLoader;
        return dataLoader;
    }
}
