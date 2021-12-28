/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from "fastify";
import { Redis } from "ioredis";
import { parse } from "json2csv";

import { getLevelById } from "../../../shared/repositories/level.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { RedisService } from "../../../shared/services/redis-tools.services";
import { 
  generateBackup,
  getBackup,
  saveBackup,
  IBackupCSV,
  restoreBackup,
  obtemDadosCSV
} from "../services/backup.service";


interface IParams {
  Headers: {
    backupid?: string;
    levelid?: string;
    isfinish?: string;
  }
}

interface IController {
  createBackup(eq: FastifyRequest, reply: FastifyReply): Promise<void>;
  restoreBackupFromDB(eq: FastifyRequest, reply: FastifyReply) : Promise<void>;
  restoreBackupFromCSV(eq: FastifyRequest, reply: FastifyReply) : Promise<void>;
}

export function backupLevelController(db: DatabaseService, rdb: DatabaseService, redis?: Redis): IController {
  const redisService = new RedisService(redis);

  const createBackup = async (req: FastifyRequest, reply: FastifyReply) => {
    if (!redis) {
      return reply.status(500).send({ message: "redis not working" });
    }
  
    const levelId = (req.query as any).id as string;
    if (!levelId) {
      return reply.status(400).send({ message: "levelId is required." });
    }
    const levelToBackup = await getLevelById(rdb)(levelId);
    if (!levelToBackup) {
      return reply.status(400).send({ message: "level does not exist." });
    }
    const date = new Date();
    const rawDate = date.toISOString().slice(0, 10).replace(/-/g, "");
    const nameBackup = `${levelToBackup?.name}_${levelToBackup?.id}_${rawDate}`;
    
    const response = await redisService.get<IBackupCSV[]>(nameBackup);
    if (response) {
      // redisService.remove(nameBackup);
      reply.header("Content-Type", "text/csv");
      return reply.send(parse(response));
    }
    
    reply.send({ loading: "loading backup" });
    
    //TODO
    
    const backup = await generateBackup(rdb, levelId);
    await saveBackup(backup, db, nameBackup);
    if (backup) {
      await redis.set(nameBackup, JSON.stringify(backup), "ex", 43200);
    } else {
      await redis.del(nameBackup);
    }
  }

  const restoreBackupFromDB = async (req: FastifyRequest<IParams>, reply: FastifyReply) => {
    if (!redis) {
      return reply.status(500).send({ message: 'redis not working' });
    }

    // id do backup e id do level onde vai ser restaurado o backup;
    const { backupid: backupId, levelid: levelId, isfinish: isFinish } = req.headers;

    if (!levelId || !backupId) {
      return reply.status(400).send({ message: 'atributos ausentes' });
    }

    const response = await getBackup(rdb, +backupId);
    const backup = response?.data as unknown as IBackupCSV[]
    if (!backup) {
      return reply.status(400).send({ message: 'Level not found' });
    }

    return restoreBackup(db, rdb, redisService, +levelId, backup, reply, parseInt(isFinish || '0'));
  }

  const restoreBackupFromCSV = async (req: FastifyRequest<IParams>, reply: FastifyReply) => {
    if (!redis) {
      return reply.status(500).send({ message: 'redis not working' });
    }

    // id do level onde vai ser restaurado o backup e o csv file;
    const { levelid: levelId, isfinish: isFinish } = req.headers;
    const fileData = await req.file();

    if (!levelId || !fileData) {
      return reply.status(400).send({ message: 'atributos ausentes' });
    }

    const file = await fileData.toBuffer();
    const backup = obtemDadosCSV(file);

    return restoreBackup(db, rdb, redisService, +levelId, backup, reply, parseInt(isFinish || '0'));
  }

  return { createBackup, restoreBackupFromDB, restoreBackupFromCSV };
}
