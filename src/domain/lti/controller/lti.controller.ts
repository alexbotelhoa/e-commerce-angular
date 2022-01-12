import { FastifyReply, FastifyRequest } from "fastify";

import { ltiParamsFactory } from '../services/lti.services';
import { Environment } from "../../../shared/types/environment.type";
import { DatabaseService } from "../../../shared/services/database.service";
import { createCurrentUserFromRequest } from "../../authorization/services/authorization.service";

interface IParams {
  Params: {
    materialId: string;
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

  const materialId = request.headers.materialid?.toString();

  if (!currentUser || !materialId) {
    return reply.status(400).send({ message: 'Parameters not found' });
  }

  const params = await ltiParamsFactory('DgcIJCkTQDTGhyMR', readonlyDb, currentUser.id, materialId);
  
  if (!params) {
    reply.status(400).send({ message: 'Error building request' });
  }

  reply.status(200).send(params);
}
