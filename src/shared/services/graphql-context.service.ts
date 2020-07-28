import { FastifyRequest } from "fastify";
import { GraphQLContext } from "../types/context.type";
import { createCurrentUserFromRequest } from "../../domain/authorization/services/authorization.service";
import { getDatabaseLoaderFactory } from "./get-database-loader.service";
import { DatabaseService } from "./database.service";

export const graphQLContextFactory = (databaseService: DatabaseService) => async (request: FastifyRequest): Promise<GraphQLContext> => {
    const context: GraphQLContext = {
        database: databaseService,
        currentUser: await createCurrentUserFromRequest(request),
        getDatabaseLoader: getDatabaseLoaderFactory(databaseService),
    };
    return context;
}
