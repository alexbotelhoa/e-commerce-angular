import mercurius from 'mercurius';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from 'fastify-cors';
import { resolvers } from './resolvers';
import fastifyRedis from 'fastify-redis';
import { fastifyExpress } from "fastify-express";
import { selectLog } from './shared/repositories/log.repository';
import fastify, { FastifyLoggerInstance, FastifyReply } from 'fastify';
import { environmentFactory } from './shared/services/environment.service';
import { graphQLContextFactory } from './shared/services/graphql-context.service';
import { DatabaseService, databaseServiceFactory } from './shared/services/database.service';
import { makeExecutableSchema, loadTypedefs, GraphQLFileLoader, mergeTypeDefs } from 'graphql-tools';
import { databaseConfigurationFromEnvironment, readonlyDatabaseConfigurationFromEnvironment } from './shared/constants/configuration.constant';

const environment = environmentFactory();
const app = fastify({
  logger: {
    level: "debug"
  },
  connectionTimeout: 120000,
  bodyLimit: 4 * 1024 * 1024
});

export const databaseService: DatabaseService = databaseServiceFactory(databaseConfigurationFromEnvironment(environment), app.log);
export const readonlyDatabaseService: DatabaseService = databaseServiceFactory(readonlyDatabaseConfigurationFromEnvironment(environment), app.log);

(async function () {
  const executeJobs = async (databaseService: DatabaseService<any, any>, logger: FastifyLoggerInstance) => {
    setInterval(async () => {
      const auditErrors = await selectLog(databaseService).where("status", "=", "audit-error")
    }, 3600000)
  }
  
  const typeDefsSources = await loadTypedefs('./src/**/*.graphql', {
    loaders: [new GraphQLFileLoader()]
  });

  const executableSchema = makeExecutableSchema({
    typeDefs: mergeTypeDefs(typeDefsSources.map(source => source.rawSDL!)),
    resolvers: resolvers,
  });
  
  await app.register(fastifyExpress)

  app.register(fastifyRedis, {
    host: environment.REDIS_HOST,
    port: Number(environment.REDIS_PORT),
  });

  app.register(fastifyCors, {
    origin: '*',
  });

  app.register(fastifyJwt, {
    secret: environment.JWT_SECRET,
  });

  app.register(mercurius, {
    schema: executableSchema,
    resolvers: {},
    context: graphQLContextFactory(databaseService, readonlyDatabaseService, app.redis),
    jit: 5,
    queryDepth: 20,
    allowBatchedQueries: true,
    graphiql: 'playground',
    routes: true,
  });

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

  await executeJobs(databaseService, app.log);
})();

console.log("BACKEND RODANDO")
