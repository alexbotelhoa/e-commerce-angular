import { FastifyRequest } from "fastify";
import { GraphQLContext } from "../types/context.type";
import { createCurrentUserFromRequest } from "../../domain/authorization/services/authorization.service";
import { getDatabaseLoaderFactory } from "./get-database-loader.service";
import { DatabaseService } from "./database.service";

export const graphQLContextFactory = (databaseService: DatabaseService, readonlyDatabaseService: DatabaseService) =>
    async (request: FastifyRequest): Promise<GraphQLContext> => {
        const context: GraphQLContext = {
            logger: request.log,
            database: databaseService,
            readonlyDatabase: readonlyDatabaseService,
            currentUser: await createCurrentUserFromRequest(request),
            getDatabaseLoader: getDatabaseLoaderFactory(readonlyDatabaseService),
        };
        return context;
    }
