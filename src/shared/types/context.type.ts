import { DatabaseService } from "../services/database.service";
import DataLoader from 'dataloader';
import { DatabaseLoaderFactory } from "./database-loader.type";
import { CurrentUser } from "./authenticated-user.type";

export interface GraphQLContext {
    currentUser: CurrentUser | null;
    database: DatabaseService;
    getDatabaseLoader: <K, V, C = K>(dataLoaderFactory: DatabaseLoaderFactory<K, V, C>) => DataLoader<K, V, C>
}
