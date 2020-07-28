import { FastifyRequest, FastifyInstance } from "fastify";
import { GraphQLContext } from "../types/context.type";
import { createCurrentUserFromRequest } from "../../domain/authorization/services/authorization.service";
import { getDatabaseLoaderFactory } from "./get-database-loader.service";
import { DatabaseService } from "./database.service";

export const graphQLContextFactory = (jwtLib: FastifyInstance['jwt'], databaseService: DatabaseService) => async (request: FastifyRequest): Promise<GraphQLContext> => {
    const context: GraphQLContext = {
        database: databaseService,
        currentUser: createCurrentUserFromRequest(jwtLib, request),
        getDatabaseLoader: getDatabaseLoaderFactory(databaseService),
    };
    return context;
}
