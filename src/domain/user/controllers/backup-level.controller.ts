import { Redis } from "ioredis";
import { parse } from "json2csv";
import { FastifyReply, FastifyRequest } from "fastify";

import { DatabaseService } from "../../../shared/services/database.service";
import { Environment } from "../../../shared/types/environment.type";
import { generateBackup, saveBackup } from "../services/backup.service";
import { getLevelById } from "../../../shared/repositories/level.repository";

interface IParams {
  levelId?: string;
}

export const backupLevelController = (
  env: Environment,
  db: DatabaseService,
  readonlyDb: DatabaseService,
  redis?: Redis
) => async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply | undefined> => {
  if (!redis) {
    return reply.status(500).send({ message: "redis not working" });
  }

  const levelId = (req.query as any).id as string;
  if (!levelId) {
    return reply.status(400).send({ message: "levelId is required." });
  }
  const levelToBackup = await getLevelById(readonlyDb)(levelId);
  if (!levelToBackup) {
    return reply.status(400).send({ message: "level does not exist." });
  }
  const date = new Date();
  const rawDate = date.toISOString().slice(0, 10).replace(/-/g, "");
  const nameBackup = `${levelToBackup?.name}_${levelToBackup?.id}_${rawDate}`;
  
  const response = await redis.get(nameBackup);
  const responseParsed = response && JSON.parse(response);
  if (responseParsed && responseParsed.csvModel) {
    reply.header("Content-Type", "text/csv");
    return reply.send(parse(responseParsed.csvModel));
  }
  
  reply.send({ loading: "loading backup" });
  
  //TODO
  
  const backup = await generateBackup(readonlyDb, levelId);
  await saveBackup(backup, db, nameBackup);
  if (backup.csvModel.length > 0 && backup.entities) {
    await redis.set(nameBackup, JSON.stringify(backup), "ex", 43200);
  } else {
    await redis.del(nameBackup);
  }
};