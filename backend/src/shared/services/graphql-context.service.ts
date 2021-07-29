import { Redis } from 'ioredis';
import { FastifyRequest } from "fastify";
import { DatabaseService } from "./database.service";
import { GraphQLContext } from "../types/context.type";
import { getDatabaseLoaderFactory } from "./get-database-loader.service";

export const graphQLContextFactory = (databaseService: DatabaseService, readonlyDatabaseService: DatabaseService, redis?: Redis) =>
    async (request: FastifyRequest): Promise<GraphQLContext> => {
        const context: GraphQLContext = {
            logger: request.log,
            database: databaseService,
            readonlyDatabase: readonlyDatabaseService,
            getDatabaseLoader: getDatabaseLoaderFactory(databaseService),
            redisClient: redis
        };
        return context;
    }
