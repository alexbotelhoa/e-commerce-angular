import fastify from 'fastify';
import { databaseConfigurationFromEnvironment } from './shared/constants/configuration.constant';
import { DatabaseService, databaseServiceFactory } from './shared/services/database.service';
import { environmentFactory } from './shared/services/environment.service';
import fastifyCors from 'fastify-cors';
import { migrationStatus } from '../knex/migrations/20201125113027_normalize_class_ids_to_campus_solution';
import { knexFile } from '../knexfile';


const environment = environmentFactory();

const databaseService: DatabaseService = databaseServiceFactory(databaseConfigurationFromEnvironment(environment));

const app = fastify({
    logger: true,
    bodyLimit: 4 * 1024 * 1024 // 4MiB
});

async function startMigration() {

    app.log.info('Starting migration for class id');

    app.register(fastifyCors, {
        origin: '*',
    });

    // Run the server!
    app.listen(3000, '0.0.0.0', (err, address) => {
        if (err) {
            throw err;
        }
        app.log.info(`server listening on ${address}`);
    });

    app.get('/', {}, (req, reply) => {
        reply.send({
            health: 'ok',
            migrationStatus: migrationStatus,
        });
    });

    app.log.info('Running knex migration');

    await databaseService.migrate.latest((knexFile.migrations));

    app.log.info('Knex migration has finished');

}

startMigration()
