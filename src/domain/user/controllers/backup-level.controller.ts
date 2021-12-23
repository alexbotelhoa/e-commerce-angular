/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from "fastify";
import { Redis } from "ioredis";
import { parse } from "json2csv";

import { getLevelById } from "../../../shared/repositories/level.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { RedisService } from "../../../shared/services/redis-tools.services";
import { 
  applyBusinessRules,
  generateBackup,
  getBackup,
  saveBackup,
  getLevel,
  getLevels,
  elementsForDeletion,
  elementsForCreation,
  elementsForUpdation,
  executeTransactions,
  logFactory,
  IBackupCSV,
  ILog,
} from "../services/backup.service";


interface IParams {
  Headers: {
    backupid?: string;
    levelid?: string;
  }
}

interface IController {
  createBackup(eq: FastifyRequest, reply: FastifyReply): Promise<void>;
  restoreBackupFronDB(eq: FastifyRequest, reply: FastifyReply) : Promise<void>;
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

  const restoreBackupFronDB = async (req: FastifyRequest<IParams>, reply: FastifyReply) => {
    if (!redis) {
      return reply.status(500).send({ message: 'redis not working' });
    }

    // id do backup e id do level onde vai ser restaurado o backup;
    const { backupid: backupId, levelid: levelId } = req.headers;

    if (!backupId || !levelId) {
      return reply.status(400).send({ message: 'atributo backupId e/ou levelId ausentes' });
    }

    // controle para saber se ja esta em processamento processamento
    const redisKey = `${levelId}-restore-backup`;
    const data = await redisService.get<ILog>(redisKey, true);
    if (data) {
      if (typeof data === 'string') {
        return reply.status(202).send({ message: 'existe uma restauração de backup desse nível em processamento' });
      }
      else {
        reply.header("Content-Type", "application/json");
        return reply.status(200).send({
          redisKey,
          redisResponse: data
        });
      }
    }

    // recupera o level atual e backup que vai entrar
    const currentLevel = await getLevel(rdb, +levelId);
    const response = await getBackup(rdb, +backupId);
    const backup = response?.data as unknown as IBackupCSV[]
    if (!backup || !currentLevel) {
      return reply.status(400).send({ message: 'Level not found' });
    }

    // recupero as informacoes para gerar o snapshot atual do level que vai sair.
    const currentLevelCSV = await generateBackup(rdb, currentLevel.id.toString());
    const rawDate = (new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    const nameBackup = `${currentLevel.name}_${levelId}_${rawDate}_automatic`;

    // aplicar regras de validação do CSV
    const { isError, backupWithErrors } = applyBusinessRules(backup); 
    if (isError) {
      return reply.status(400).send(backupWithErrors);
    }

    // busca o level que vai entrar e o level que vai sair
    const levels = await getLevels(rdb, backup, +levelId);
    
    // seta no level os elementos a serem excluidos;
    elementsForDeletion(levels.levelIn, levels.levelOut);

    // seta no level os alementos a serem criados
    elementsForCreation(levels.levelIn, levels.levelOut);
    
    // seta no level os elementeos a serem atualizados
    elementsForUpdation(levels.levelIn, levels.levelInNow);

    // caso a requisição demore mais que meio minuto o servidor devolve uma mensagem que notificando que será processado em segundo plano
    redisService.flag = true;
    redisService.setInRedisAfterTimeExpires(redisKey, reply);

    // então, executa as transacoes garantindo que todas tenham exito.
    try {
      await executeTransactions(db, levels.levelIn, levels.levelInNow, levels.levelOut);
      await saveBackup(currentLevelCSV, db, nameBackup); // 
    } catch {
      return redisService.throwInRedisAfterTimeExpires(redisKey, reply);
    }

    // um obheto de log com os ids de cada alteracao.
    const log = logFactory(levels.levelIn, levels.levelOut);

    // verifica se executou apos o tempo esperado
    if (!redisService.flag) { 
      redisService.set(redisKey, log);
      return;
    } 

    // indica que executou antes do tempo limite
    redisService.flag = false;
    reply.status(200).send(log);
  }

  return { createBackup, restoreBackupFronDB };
}
