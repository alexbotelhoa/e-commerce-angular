import { DatabaseService } from "../services/database.service";
import DataLoader from 'dataloader';
import { DatabaseLoaderFactory } from "./database-loader.type";
import { AuthenticatedUser } from "./authenticated-user.type";

export interface GraphQLContext {
    currentUser: AuthenticatedUser | null;
    database: DatabaseService;
    getDatabaseLoader: <K, V, C = K>(dataLoaderFactory: DatabaseLoaderFactory<K, V, C>) => DataLoader<K, V, C>
}
