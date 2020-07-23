import { DatabaseService } from "../services/database.service";
import DataLoader from 'dataloader';
import { DatabaseLoaderFactory } from "./database-loader.type";

export interface GraphQLContext {
    database: DatabaseService;
    getDatabaseLoader: <K, V, C = K>(dataLoaderFactory: DatabaseLoaderFactory<K, V, C>) => DataLoader<K, V, C>
}
