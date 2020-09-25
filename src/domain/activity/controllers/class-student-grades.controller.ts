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
    emplid: t.union([t.string, t.undefined, t.null]),
});

const exactClassStudentGradesFilters = t.exact(ClassStudentGradesFilters);


export const classStudentGradesController = (env: Environment, db: DatabaseService) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const decodedBody = exactClassStudentGradesFilters.decode(request.body);
    if (decodedBody._tag === 'Left') {
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
        studentIds: body.emplid ? [body.emplid] : []
    }

    const context = await graphQLContextFactory(db)(request);

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

    if (graphqlResult.errors) {
        return reply
            .status(400)
            .send({
                message: graphqlResult.errors.join(','),
            });
    }

    if (!graphqlResult.data) {
        return reply
            .status(400)
            .send({
                message: 'Unable to process graphql request data.',
            });
    }

    reply
        .status(200)
        .send({
            message: 'Ok'
        });

    try {
        const integrationRequest = await axios.post(env.STUDENT_GRADE_INTEGRATION_URL, {
            "instituicao": body.instituicao || null,
            "carreira": body.carreira || null,
            "periodo": body.periodo || null,
            "sessao": body.sessao || null,
            "chaveRequest": body.chaveRequest,
            "responseTotal": '1',
            "responsePart": '1',
            turmas: graphqlResult.data.turmas,
        }, {
            headers: {
                'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
            },
            responseType: 'json',
        });
    }
    catch (error) {
        console.error({
            message: 'Error integrating with Digibee endpoint',
            error: error,
        });
    }

}
