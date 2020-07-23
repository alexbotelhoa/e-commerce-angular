import { DatabaseService } from "./database.service"
import { DatabaseLoaderFactory } from "../types/database-loader.type"
import DataLoader from 'dataloader';

/**
 * Service to generate database-based dataloader from DatabaseLoaderFactory functions
 * @param db 
 */
export const getDatabaseLoaderFactory = (db: DatabaseService) => {
    // internal cache for dataloaders by factory name
    const cache: Record<string, DataLoader<any, any, any> | undefined> = {};

    return (dbLoaderFactory: DatabaseLoaderFactory<any, any, any>) => {
        const factoryFunctionName = dbLoaderFactory.toString();
        // check if already cached by using the factory's function name
        const cached = cache[factoryFunctionName];
        if (cached) {
            return cached;
        }
        // not cached, create from factory, cache and return it
        const loaderImpl = dbLoaderFactory(db);
        const dataLoader = new DataLoader(loaderImpl.batchFn, loaderImpl.options)
        cache[factoryFunctionName] = dataLoader;
        return dataLoader;
    }
}

