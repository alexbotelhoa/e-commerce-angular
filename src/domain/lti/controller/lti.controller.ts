import { FastifyReply, FastifyRequest } from "fastify";

import { ltiParamsFactory } from '../services/lti.services';
import { Environment } from "../../../shared/types/environment.type";
import { DatabaseService } from "../../../shared/services/database.service";
import { createCurrentUserFromRequest } from "../../authorization/services/authorization.service";

interface IParams {
  Params: {
    levelCodeId: string;
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

  console.log("request.headers: ", request.headers)

  const levelCodeId = request.headers.levelcodeid;
  const materialId = request.headers.materialid;

  if (!currentUser || !levelCodeId || !materialId) {
    return reply.status(400).send({ message: 'Parameters not found' });
  }
  
  const headers = {
    levelCodeId: levelCodeId.toString(),
    materialId: materialId.toString(),
  };

  const params = await ltiParamsFactory('DgcIJCkTQDTGhyMR', readonlyDb, currentUser.id, headers);
  
  if (!params) {
    reply.status(400).send({ message: 'Error building request' });
  }

  reply.status(200).send(params);
}
