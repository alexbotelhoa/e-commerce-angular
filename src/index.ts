import dotenv from 'dotenv';

dotenv.config({
  debug: true,
});

import fastify, { FastifyRequest } from 'fastify';
import fastifyGQL from 'fastify-gql';
import { makeExecutableSchema, addMocksToSchema, loadTypedefs, GraphQLFileLoader, mergeTypeDefs } from 'graphql-tools';
import { resolvers } from './resolvers';
import { GraphQLContext } from './shared/types/context.type';
import { databaseService } from './shared/services/database.service';
import { getDatabaseLoaderFactory } from './shared/services/get-database-loader.service';
import { createCurrentUserFromRequest } from './domain/authorization/services/authorization.service';

// Require the framework and instantiate it
const app = fastify({
  logger: true
});

(async function () {
  const typeDefsSources = await loadTypedefs('./src/**/*.graphql', {
    loaders: [new GraphQLFileLoader()]
  });

  const executableSchema = makeExecutableSchema({
    typeDefs: mergeTypeDefs(typeDefsSources.map(source => source.rawSDL!)),
    resolvers: resolvers as any,
  });

  app.register(fastifyGQL, {
    schema: addMocksToSchema({
      schema: executableSchema,
      preserveResolvers: true,
    }),
    resolvers: {},
    context: async (request: FastifyRequest) => {
      const context: GraphQLContext = {
        database: databaseService,
        currentUser: createCurrentUserFromRequest(request),
        getDatabaseLoader: getDatabaseLoaderFactory(databaseService),
      };
      return context;
    },
    jit: 5,
    queryDepth: 20,
    allowBatchedQueries: true,
    graphiql: 'playground',
    routes: true,
  })

  // Run the server!
  app.listen(3000, (err, address) => {
    if (err) throw err
    app.log.info(`server listening on ${address}`)
  })


})();







