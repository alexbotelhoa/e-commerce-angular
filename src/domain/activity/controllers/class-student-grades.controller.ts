import { FastifyReply, FastifyRequest } from "fastify";
import * as t from "io-ts";
import { GQLClassesQueryInput, GQLClassStudentGradesInput } from "../../../resolvers-types";
import { DatabaseService } from "../../../shared/services/database.service";
import { graphQLContextFactory } from "../../../shared/services/graphql-context.service";
import { Environment } from "../../../shared/types/environment.type";
import axios from 'axios';

const ClassStudentGradesFilters = t.type({
    chaveRequest: t.string,
    instituicao: t.union([t.string, t.undefined, t.null]),
    carreira: t.union([t.string, t.undefined, t.null]),
    periodo: t.union([t.string, t.undefined, t.null]),
    sessao: t.union([t.string, t.undefined, t.null]),
    turma: t.union([t.string, t.undefined, t.null]),
    aluno: t.union([t.string, t.undefined, t.null]),
});

const exactClassStudentGradesFilters = t.exact(ClassStudentGradesFilters);


export const classStudentGradesController = (env: Environment, db: DatabaseService, readonlyDb: DatabaseService) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const logger = request.log;

    logger.info({
        data: {
            body: request.body,
        }
    }, 'ClassStudentGrades request received');

    const decodedBody = exactClassStudentGradesFilters.decode(request.body);
    if (decodedBody._tag === 'Left') {
        logger.error({
            msg: 'classStudentGradesController validation error',
            data: {
                body: request.body,
            }
        });
        throw new Error(`invalid input`);
    }

    const body = decodedBody.right;

    const classesInput: GQLClassesQueryInput = {
        ids: body.turma ? [body.turma] : [],
        carrerIds: body.carreira ? [body.carreira] : [],
        institutionIds: body.instituicao ? [body.instituicao] : [],
        periodIds: body.periodo ? [body.periodo] : [],
        sessionIds: body.sessao ? [body.sessao] : [],
    };

    const classStudentGradesInput: GQLClassStudentGradesInput = {
        studentIds: body.aluno ? [body.aluno] : []
    }

    logger.info({
        msg: 'classStudentGradesController variables defined',
        data: {
            classesInput,
            classStudentGradesInput,
        }
    });

    const context = await graphQLContextFactory(db, readonlyDb)(request);

    logger.info({
        msg: 'classStudentGradesController created graphql context',
        data: {
            context,
        }
    });

    const graphqlResult = await reply.graphql(`
query ClassStudentGrades(
  $classesInput: ClassesQueryInput,
  $classStudentGradesInput: ClassStudentGradesInput
) {
  turmas: classes(data: $classesInput) {
    turma: id
    alunos: studentGrades(data: $classStudentGradesInput) {
      emplid: studentId
      avaliacoes: grades {
        avaliacao: typeId
        nota: grade
      }
    }
  }
}
    `, context, {
        classesInput: classesInput,
        classStudentGradesInput: classStudentGradesInput,
    });

    logger.info({
        data: {
            graphqlResult: graphqlResult,
        }
    }, 'classStudentGradesController executed graphql');

    if (graphqlResult.errors) {
        logger.error({
            data: {
                graphqlResult: graphqlResult,
            }
        }, 'classStudentGradesController error in graphql execution');
        return reply
            .status(400)
            .send({
                msg: graphqlResult.errors.join(','),
            });
    }

    if (!graphqlResult.data) {
        logger.info({
            data: {
                graphqlResult: graphqlResult,
            }
        }, 'classStudentGradesController graphql execution resulted in empty data');
        return reply
            .status(400)
            .send({
                msg: 'Unable to process graphql request data.',
            });
    }

    logger.info({
        data: {
            graphqlResult: graphqlResult,
        }
    }, 'classStudentGradesController graphql execution success');

    const successfulMessage = {
        msg: 'Ok'
    };

    reply
        .status(200)
        .send(successfulMessage);

    logger.info({
        data: {
            response: successfulMessage,
        }
    }, 'classStudentGradesController responded with successful reply');

    const turmas: any[] = graphqlResult.data.turmas;

    const maxResultsPerRequest = 100;

    const totalParts = Math.ceil(turmas.length / maxResultsPerRequest);

    const parts = turmas.reduce<any[][]>((acc, turma, index) => {
        const currentPartIndex = Math.floor(index / maxResultsPerRequest);
        if (!acc[currentPartIndex]) {
            acc.push([]);
        }
        const currentArray = acc[currentPartIndex];
        currentArray.push(turma);
        return acc;
    }, []);

    for (let i = 0; i < totalParts; i++) {
        const part = parts[i];
        const responsePart = i + 1;

        logger.info({
            data: {
                data: {
                    "instituicao": body.instituicao || null,
                    "carreira": body.carreira || null,
                    "periodo": body.periodo || null,
                    "sessao": body.sessao || null,
                    "turma": body.turma || null,
                    "emplid": body.aluno || null,
                    "chaveRequest": body.chaveRequest,
                    "responseTotal": totalParts,
                    "responsePart": responsePart,
                },
            }
        }, 'classStudentGradesController preparing integration request');

        try {
            const integrationRequest = await axios.post(env.STUDENT_GRADE_INTEGRATION_URL, {
                "instituicao": body.instituicao || null,
                "carreira": body.carreira || null,
                "periodo": body.periodo || null,
                "sessao": body.sessao || null,
                "turma": body.turma || null,
                "emplid": body.aluno || null,
                "chaveRequest": body.chaveRequest,
                "responseTotal": totalParts,
                "responsePart": responsePart,
                turmas: part,
            }, {
                headers: {
                    'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
                },
                responseType: 'json',
            });

            logger.info({
                data: {
                    response: {
                        data: integrationRequest.data,
                        status: integrationRequest.status,
                        headers: integrationRequest.headers,
                        statusText: integrationRequest.statusText,
                    },
                }
            }, 'classStudentGradesController integration response received');
        }
        catch (error) {
            logger.error({
                err: error
            }, 'classStudentGradesController integration response error');
        }
    }

}
