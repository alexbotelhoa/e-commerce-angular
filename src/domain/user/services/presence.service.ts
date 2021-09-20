import { FastifyLoggerInstance } from 'fastify';
import { environmentFactory } from '../../../shared/services/environment.service';
import axios from 'axios';
import { insertLog } from '../../../shared/repositories/log.repository';
import { DatabaseService } from '../../../shared/services/database.service';

interface BodyPresence {
    turma: string;
    userId: string;
    tentativas?: number;
}

export const callPresence = async (body: BodyPresence, logger: FastifyLoggerInstance): Promise<void> => {
    const env = environmentFactory()
    const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "dadosacademicos")}/${body.userId}/eventos/presencas`
    try {
        await axios.post(url, {
            presenca: true,
            turma: body.turma,
        }, {
            headers: {
                'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
            },
            responseType: 'json',
        });
    } catch (error) {
        logger.error({
            msg: 'presence service request error',
            errorMessage: error.message || "",
            data: {
                body
            }
        });
        throw error;
    }
}

export const callPresenceService = async (body: BodyPresence, databaseService: DatabaseService, logger: FastifyLoggerInstance): Promise<boolean> => {
        try {
            await callPresence(body, logger)
            await insertLog(databaseService)({
                status: "presence-success",
                key: body.turma,
                body: JSON.stringify({body, tentativas: 1}),

            })
            return true;
        } catch (error) {
            await insertLog(databaseService)({
                status: "presence-error",
                key: body.turma,
                body: JSON.stringify({body, tentativas: 1, error: error?.message || "no message provided"}),

            })
            return false;
        }
}
