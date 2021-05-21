import { DatabaseService } from "../services/database.service";
import DataLoader from 'dataloader';
import { DatabaseLoaderFactory } from "./database-loader.type";
import { AuthenticatedUser } from "./authenticated-user.type";
import { FastifyLoggerInstance } from "fastify";
import { Redis } from 'ioredis';

export interface GraphQLContext {
    currentUser: AuthenticatedUser | null;
    database: DatabaseService;
    readonlyDatabase: DatabaseService;
    logger: FastifyLoggerInstance,
    getDatabaseLoader: <K, V, C = K, P = undefined>(dataLoaderFactory: DatabaseLoaderFactory<K, V, C, P>, params: P) => DataLoader<K, V, C>,
    redisClient?: Redis,
}
