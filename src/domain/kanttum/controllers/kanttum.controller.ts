import { FastifyReply, FastifyRequest } from "fastify";

import { kanttumFactory } from '../services/kanttum.services';
import { Environment } from "../../../shared/types/environment.type";
import { getUserById } from "../../../shared/repositories/user.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { createCurrentUserFromRequest } from "../../authorization/services/authorization.service";

export const KanttumController = (
  env: Environment, 
  readonlyDb: DatabaseService
) => async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const currentUser = await createCurrentUserFromRequest(request);

  if (!currentUser) {
    return reply.status(400).send({ message: 'User not found' });
  }

  const user = await getUserById(readonlyDb)(currentUser.id);

  if (!user || !user.name || !user.accountId ) {
    return reply.status(400).send({ message: 'Error user params' });
  }

  const params = await kanttumFactory(user.name, user.accountId);

  if (!params) {
    return reply.status(400).send({ message: 'Error Kanttum request' });
  }

  reply.status(200).send(params);
}
