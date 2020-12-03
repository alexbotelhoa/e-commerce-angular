import fastify from 'fastify';
import mercurius from 'mercurius';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from 'fastify-cors';

import { makeExecutableSchema, loadTypedefs, GraphQLFileLoader, mergeTypeDefs } from 'graphql-tools';
import { resolvers } from './resolvers';
import { environmentFactory } from './shared/services/environment.service';
import { DatabaseService, databaseServiceFactory } from './shared/services/database.service';
import { databaseConfigurationFromEnvironment, readonlyDatabaseConfigurationFromEnvironment } from './shared/constants/configuration.constant';
import { authenticationController } from './domain/authentication/controllers/authentication.controller';
import { graphQLContextFactory } from './shared/services/graphql-context.service';
import { validateURL } from './shared/utils/validate-url'
import { filterHTML } from './shared/utils/filter-html'
import { makeRequest } from './shared/utils/make-http-request'
import { classStudentGradesController } from './domain/activity/controllers/class-student-grades.controller';
import { webhookEventsController } from './domain/user/controllers/webhook-events.controller';
import { studentReportController } from './domain/user/controllers/student-report.controller';


const environment = environmentFactory();

export const databaseService: DatabaseService = databaseServiceFactory(databaseConfigurationFromEnvironment(environment));
export const readonlyDatabaseService: DatabaseService = databaseServiceFactory(readonlyDatabaseConfigurationFromEnvironment(environment));
// Require the framework and instantiate it
const app = fastify({
  logger: true,
  bodyLimit: 4 * 1024 * 1024 // 4MiB
});

(async function () {
  const typeDefsSources = await loadTypedefs('./src/**/*.graphql', {
    loaders: [new GraphQLFileLoader()]
  });

  const executableSchema = makeExecutableSchema({
    typeDefs: mergeTypeDefs(typeDefsSources.map(source => source.rawSDL!)),
    resolvers: resolvers,
  });

  app.register(fastifyCors, {
    origin: '*',
  });

  // register jwt handler with secret
  app.register(fastifyJwt, {
    secret: environment.JWT_SECRET,
  });


  // register GraphQL endpoint
  app.register(mercurius, {
    schema: executableSchema,
    resolvers: {},
    context: graphQLContextFactory(databaseService, readonlyDatabaseService),
    jit: 5,
    queryDepth: 20,
    allowBatchedQueries: true,
    graphiql: 'playground',
    routes: true,
  })

  // Run the server!
  app.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
      throw err;
    }
    app.log.info(`server listening on ${address}`);
  });

  app.get('/', {}, (req, reply) => {
    reply.send({
      health: 'ok'
    });
  })

  app.get('/proxy/*', async (request: Record<string, any>, reply) => {
    const { '*': url } = request.params;

    if (!validateURL(url)) {
      reply
        .code(400)
        .send({ error: 'Invalid url parameter!' })
      return
    }

    reply
      .type('text/html')
      .send(await filterHTML(await makeRequest(url), url))
  })

  app.post('/authentication', {}, authenticationController(environment.CI_PORTAL_URL, databaseService));

  app.post('/student-grades', {}, classStudentGradesController(environment, databaseService, readonlyDatabaseService));
  app.get('/student-report.csv', {}, studentReportController(environment, databaseService, readonlyDatabaseService));

  app.post('/webhook-events', {}, webhookEventsController(databaseService));
})();







