import fastify, { FastifyRequest } from 'fastify';
import fastifyGQL from 'fastify-gql';
import fastifyFormbody from 'fastify-formbody';
import fastifyJwt from 'fastify-jwt';
import { makeExecutableSchema, addMocksToSchema, loadTypedefs, GraphQLFileLoader, mergeTypeDefs } from 'graphql-tools';
import { resolvers } from './resolvers';
import { environmentFactory } from './shared/services/environment.service';
import { DatabaseService, databaseServiceFactory } from './shared/services/database.service';
import { databaseConfigurationFromEnvironment } from './shared/constants/configuration.constant';
import { authenticationController } from './domain/authentication/controllers/authentication.controller';
import { graphQLContextFactory } from './shared/services/graphql-context.service';

const environment = environmentFactory();

export const databaseService: DatabaseService = databaseServiceFactory(databaseConfigurationFromEnvironment(environment));

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
    resolvers: resolvers,
  });

  // this is only necessary if we're receiving the post data via formBody, otherwise we can remove it
  app.register(fastifyFormbody);

  // register jwt handler with secret
  app.register(fastifyJwt, {
    secret: environment.JWT_SECRET,
  });


  // register GraphQL endpoint
  app.register(fastifyGQL, {
    schema: addMocksToSchema({
      schema: executableSchema,
      preserveResolvers: true,
    }),
    resolvers: {},
    context: graphQLContextFactory(app.jwt, databaseService),
    jit: 5,
    queryDepth: 20,
    allowBatchedQueries: true,
    graphiql: 'playground',
    routes: true,
  })

  // Run the server!
  app.listen(3000, (err, address) => {
    if (err) {
      throw err;
    }
    app.log.info(`server listening on ${address}`);
  })

  app.post('/authentication', {
    schema: {}
  }, authenticationController(environment.CI_PORTAL_URL));
})();







