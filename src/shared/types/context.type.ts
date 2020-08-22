import { DatabaseService } from "../services/database.service";
import DataLoader from 'dataloader';
import { DatabaseLoaderFactory } from "./database-loader.type";
import { AuthenticatedUser } from "./authenticated-user.type";

export interface GraphQLContext {
    currentUser: AuthenticatedUser | null;
    database: DatabaseService;
    getDatabaseLoader: <K, V, C = K, P = undefined>(dataLoaderFactory: DatabaseLoaderFactory<K, V, C, P>, params: P) => DataLoader<K, V, C>
}
