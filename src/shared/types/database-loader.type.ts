import { DatabaseService } from "../services/database.service"
import DataLoader from 'dataloader';

export interface DataloaderLoaderData<K, V, C = K> {
    batchFn: DataLoader.BatchLoadFn<K, V>;
    options?: DataLoader.Options<K, V, C>;
}

export type DatabaseLoaderFactory<K, V, C = K> =
    (db: DatabaseService) => DataloaderLoaderData<K, V, C>;
