import { FastifyRequest } from "fastify";
import { GraphQLContext } from "../types/context.type";
import { createCurrentUserFromRequest } from "../../domain/authorization/services/authorization.service";
import { getDatabaseLoaderFactory } from "./get-database-loader.service";
import { DatabaseService } from "./database.service";
import { Redis } from 'ioredis';

export const graphQLContextFactory = (databaseService: DatabaseService, readonlyDatabaseService: DatabaseService, redis?: Redis) =>
    async (request: FastifyRequest): Promise<GraphQLContext> => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const context: GraphQLContext = {
            logger: request.log,
            database: databaseService,
            readonlyDatabase: readonlyDatabaseService,
            currentUser: await createCurrentUserFromRequest(request),
            getDatabaseLoader: getDatabaseLoaderFactory(databaseService),
            redisClient: redis
        };
        return context;
    }
