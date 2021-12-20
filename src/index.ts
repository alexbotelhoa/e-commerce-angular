import https from "https";
import mysql2 from "mysql2";
import AWSSdk from "aws-sdk";
import mercurius from 'mercurius';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from 'fastify-cors';
import * as AWSXRay from 'aws-xray-sdk';
import fastifyRedis from 'fastify-redis';
import { fastifyExpress } from "fastify-express";
import fastify, { FastifyLoggerInstance, FastifyReply } from 'fastify';
import { makeExecutableSchema, loadTypedefs, GraphQLFileLoader, mergeTypeDefs } from 'graphql-tools';

import { resolvers } from './resolvers';
import { filterHTML } from './shared/utils/filter-html';
import { validateURL } from './shared/utils/validate-url';
import { makeRequest } from './shared/utils/make-http-request';
import { selectLog } from './shared/repositories/log.repository';
import { callBackAudit } from './domain/user/services/audit.service';
import { LtiController } from './domain/lti/controller/lti.controller';
import { environmentFactory } from './shared/services/environment.service';
import { graphQLContextFactory } from './shared/services/graphql-context.service';
import { KanttumController } from "./domain/kanttum/controllers/kanttum.controller";
import { backupLevelController } from './domain/user/controllers/backup-level.controller';
import { DatabaseService, databaseServiceFactory } from './shared/services/database.service';
import { webhookEventsController } from './domain/user/controllers/webhook-events.controller';
import { studentReportController } from './domain/user/controllers/student-report.controller';
import { authenticationController } from './domain/authentication/controllers/authentication.controller';
import { myNotesUsageReportController } from './domain/user/controllers/my-notes-usage-report.controller';
import { classStudentGradesController } from './domain/activity/controllers/class-student-grades.controller';
import { studentInterestReportController } from './domain/user/controllers/student-interest-report.controller';
import { studentInactivityReportController } from './domain/user/controllers/student-inactivity-report.controller';
import { databaseConfigurationFromEnvironment, readonlyDatabaseConfigurationFromEnvironment } from './shared/constants/configuration.constant';


AWSXRay.captureMySQL(mysql2 as any);
const AWS = AWSXRay.captureAWS(AWSSdk);
AWS.config.update({ region: 'us-east-1', });
AWSXRay.captureHTTPsGlobal(https);
AWSXRay.setContextMissingStrategy("LOG_ERROR");
AWSXRay.setDaemonAddress('xrayprd.lxp.culturainglesa.com.br:2000');

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
  // TODO Change to Cron Job or endpoint

  const executeJobs = async (databaseService: DatabaseService<any, any>, logger: FastifyLoggerInstance) => {
    setInterval(async () => {
      const auditErrors = await selectLog(readonlyDatabaseService).where("status", "=", "audit-error")
      await callBackAudit(auditErrors, databaseService, logger)
    }, 3600000)

  }
  app.register(fastifyRedis, {
    host: environment.REDIS_HOST,
    port: Number(environment.REDIS_PORT),
  })
  const typeDefsSources = await loadTypedefs('./src/**/*.graphql', {
    loaders: [new GraphQLFileLoader()]
  });

  const executableSchema = makeExecutableSchema({
    typeDefs: mergeTypeDefs(typeDefsSources.map(source => source.rawSDL!)),
    resolvers: resolvers,
  });
  await app.register(fastifyExpress)
  app.use(AWSXRay.express.openSegment('LXP BackEnd Horizon One'));

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
    context: graphQLContextFactory(databaseService, readonlyDatabaseService, app.redis),
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
      return;
    }

    reply
      .type('text/html')
      .send(await filterHTML(await makeRequest(url), url))
  })

  app.post('/webhook-events', {}, webhookEventsController(databaseService, readonlyDatabaseService, app.redis));
  app.post('/authentication', {}, authenticationController(environment.CI_PORTAL_URL, databaseService, readonlyDatabaseService));
  app.post('/horizon-one-authentication', {}, authenticationController(environment.HORIZON_ONE_URL, databaseService, readonlyDatabaseService));

  app.post('/student-grades', {}, classStudentGradesController(environment, databaseService, readonlyDatabaseService));
  app.get('/student-report.csv', {}, studentReportController(environment, databaseService, readonlyDatabaseService, app.redis));
  app.get('/my-notes-usage-report.csv', {}, myNotesUsageReportController(environment, databaseService, readonlyDatabaseService, app.redis));
  app.get('/student-interest-report.csv', {}, studentInterestReportController(environment, databaseService, readonlyDatabaseService, app.redis));
  app.get('/student-inactivity-report.csv', {}, studentInactivityReportController(environment, databaseService, readonlyDatabaseService, app.redis));
  
  app.get('/restore-level', {}, backupLevelController(databaseService, readonlyDatabaseService, app.redis).restoreBackupFronDB);
  app.get('/backup-level.csv', {}, backupLevelController(databaseService, readonlyDatabaseService, app.redis).createBackup);

  app.get('/lti/params/:levelId', {}, LtiController(environment, readonlyDatabaseService));
  app.get('/kanttum', {}, KanttumController(environment, readonlyDatabaseService));

  app.get("/redis/*", {}, async (req: Record<string, any>, reply: FastifyReply) => {
    const { '*': key } = req.params;
    if (key) {
      try {
        return app.redis.get(key)
      } catch (error) {
        return {
          error: error.message,
          stack: error.stack,
        }
      }

    } else {
      return { message: "empty key" }
    }
  })

  app.delete("/redis/delete", {}, async (req: Record<string, any>, reply: FastifyReply) => {
    try {
      return app.redis.flushall()
    } catch (error) {
      return {
        error: error.message,
        stack: error.stack,
      }
    }
  })

  app.delete("/redis/delete/*", {}, async (req: Record<string, any>, reply: FastifyReply) => {
    let { '*': key } = req.params;
    try {
      const haveStar = (key as string).includes("*")
      key = haveStar ? key : key + '*'
      const keys =  await app.redis.scan(0, "MATCH", key)
      if (keys && keys[1] && keys[1].length === 0) {
        return {
          totalDeleted: 0,
          message: "No record to delete"
        }
      }
      return {totalDeleted: await app.redis.unlink(...keys[1])}
    } catch (error) {
      return {
        error: error.message,
        stack: error.stack,
      }
    }
  })

  app.get("/redis/pattern-full/*", {}, async (req: Record<string, any>, reply: FastifyReply) => {
    let { '*': key } = req.params;
    if (key) {
      try {
        const haveStar = (key as string).includes("*")
        key = haveStar ? key : key + '*'
        const keys =  await app.redis.scan(0, "MATCH", key)
        const keysFound = keys[1];
        const result = await app.redis.mget(...keysFound);
        return result.map(item => item && JSON.parse(item) || null)
      } catch (error) {
        return {
          error: error.message,
          stack: error.stack,
        }
      }
    } else {
      return { message: "empty key" };
    }
  })

  app.get("/redis/pattern/*", {}, async (req: Record<string, any>, reply: FastifyReply) => {
    let { '*': key } = req.params;
    if (key) {
      try {
        const haveStar = (key as string).includes("*")
        key = haveStar ? key : key + '*'
        const keys =  await app.redis.scan(0, "MATCH", key)
        return keys[1];
      } catch (error) {
        return {
          error: error.message,
          stack: error.stack,
        }
      }
    } else {
      return { message: "empty key" }
    }
  })

  app.use(AWSXRay.express.closeSegment());

  await executeJobs(databaseService, app.log);
})();

console.log("PROJETO RODANDO COM CODIGO MAIS RECENTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
