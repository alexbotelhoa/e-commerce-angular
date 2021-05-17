import fastify, { FastifyLoggerInstance } from 'fastify';
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
import { selectLog } from './shared/repositories/log.repository';
import { callBackAudit } from './domain/user/services/audit.service';
import { studentInterestReportController } from './domain/user/controllers/student-interest-report.controller';
import fastifyXray from 'fastify-xray';



const environment = environmentFactory();
const app = fastify({
  logger: {
    level: "debug"
  },
  connectionTimeout: 120000,
  bodyLimit: 4 * 1024 * 1024 // 4MiB
});

export const databaseService: DatabaseService = databaseServiceFactory(databaseConfigurationFromEnvironment(environment), app.log);
export const readonlyDatabaseService: DatabaseService = databaseServiceFactory(readonlyDatabaseConfigurationFromEnvironment(environment), app.log);
// Require the framework and instantiate it
(async function () {

  const executeJobs = async (databaseService: DatabaseService<any, any>, logger: FastifyLoggerInstance) => {
    setInterval(async () => {
      const auditErrors = await selectLog(databaseService).where("status", "=", "audit-error")
      await callBackAudit(auditErrors, databaseService, logger)
    }, 86400000)

  }

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

  app.register(fastifyXray, {
    defaultName: "LXP BackEnd Horizon One",
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

  app.post('/horizon-one-authentication', {}, authenticationController(environment.HORIZON_ONE_URL, databaseService));

  app.post('/student-grades', {}, classStudentGradesController(environment, databaseService, readonlyDatabaseService));
  app.get('/student-report.csv', {}, studentReportController(environment, databaseService, readonlyDatabaseService));
  app.get('/student-interest-report.csv', {}, studentInterestReportController(environment, databaseService, readonlyDatabaseService));

  app.post('/webhook-events', {}, webhookEventsController(databaseService));


  // await executeJobs(databaseService, app.log);
})();







