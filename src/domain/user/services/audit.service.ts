import { FastifyLoggerInstance } from 'fastify';
import { environmentFactory } from '../../../shared/services/environment.service';
import axios from 'axios';
import { LogEntity } from '../../../entities/log.entity';
import { deleteLog, updateLog } from '../../../shared/repositories/log.repository';
import { DatabaseService } from '../../../shared/services/database.service';

interface BodyAudit {
    id_plataforma: number;
    id_recurso: number;
    id_turma: string;
    userId: string;
    tentativas?: number;
}

export const callAudit = async (body: BodyAudit, logger: FastifyLoggerInstance): Promise<void> => {
    const env = environmentFactory()
    const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "portalservices")}/logs/${body.userId}/acessos`
    try {
        await axios.post(url, {
            id_plataforma: body.id_plataforma,
            id_recurso: body.id_recurso,
            id_turma: body.id_turma,
        }, {
            headers: {
                'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
            },
            responseType: 'json',
        });
    } catch (error) {
        logger.error({
            msg: 'audit service request error',
            errorMessage: error.message || "",
            data: {
                body
            }
        });
        throw error;
    }
}

export const callBackAudit = async (auditToSend: LogEntity[], databaseService: DatabaseService, logger: FastifyLoggerInstance): Promise<void> => {
    for (const audit of auditToSend) {
        const body: BodyAudit = JSON.parse(audit.body)
        if (!body.userId) {
            await deleteLog(databaseService)(qb => qb.where("id", "=", audit.id));
            return;
        }
        try {
            await callAudit(body, logger)
            await updateLog(databaseService)({ status: "audit-success" })(qb => qb.where("id", "=", audit.id));
        } catch (error) {
            await updateLog(databaseService)(
                {
                    body: JSON.stringify(
                        {
                            ...body, tentativas: body.tentativas
                                ? body.tentativas + 1
                                : 1
                        })
                })(qb => qb.where("id", "=", audit.id));
        }

    }
}
