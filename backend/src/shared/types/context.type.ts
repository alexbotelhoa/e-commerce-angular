import { Redis } from 'ioredis';
import DataLoader from 'dataloader';
import { FastifyLoggerInstance } from "fastify";
import { DatabaseLoaderFactory } from "./database-loader.type";
import { DatabaseService } from "../services/database.service";

export interface GraphQLContext {
    database: DatabaseService;
    readonlyDatabase: DatabaseService;
    logger: FastifyLoggerInstance,
    getDatabaseLoader: <K, V, C = K, P = undefined>(dataLoaderFactory: DatabaseLoaderFactory<K, V, C, P>, params: P) => DataLoader<K, V, C>,
    redisClient?: Redis,
}
