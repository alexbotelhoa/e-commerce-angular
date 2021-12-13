import { FastifyReply, FastifyRequest } from "fastify";

import { DatabaseService } from "../../../shared/services/database.service";
import { Environment } from "../../../shared/types/environment.type";
import { createCurrentUserFromRequest } from "../../authorization/services/authorization.service";
import { ltiParamsFactory } from '../services/lti.services'

interface IParams {
  Params: {
    userId?: string;
    levelId?: string;
  }
}

export const LtiController = (
  env: Environment, 
  readonlyDb: DatabaseService
) => async (
  request: FastifyRequest<IParams>, 
  reply: FastifyReply
): Promise<void> => {
  const currentUser = await createCurrentUserFromRequest(request);
  const levelId = request.params?.levelId; 

  if (!currentUser || !levelId) {
    return reply.status(400).send({ message: 'Parametros ausentes' });
  }

  // colocar a key nas variaveis de ambiente;
  const params = await ltiParamsFactory('DgcIJCkTQDTGhyMR', readonlyDb, currentUser.id, +levelId);
  
  if (!params) {
    reply.status(400).send({ message: 'Erro ao montar assinatura' });
  }

  reply.status(200).send(params);
}