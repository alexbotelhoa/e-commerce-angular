/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from "fastify";
import { Redis } from "ioredis";
import { parse } from "json2csv";

import { getLevelById } from "../../../shared/repositories/level.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { 
  workInRedis,
  applyBusinessRules,
  BackupResponse,
  generateBackup,
  getBackup,
  saveBackup,
  getLevels,
  elementsForDeletion,
  elementsForCreation,
  elementsForUpdation,
  executeTransactions,
  logFactory,
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

export function backupLevelController(db: DatabaseService, readonlyDb: DatabaseService, redis?: Redis): IController {

  const createBackup = async (req: FastifyRequest, reply: FastifyReply) => {
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
    const redisResponse = await workInRedis(redis).get(redisKey);
    if (redisResponse) {
      if (redisResponse === 'inProcess') {
        return reply.status(202).send({ message: 'existe uma restauração de backup desse nível em processamento' });
      }
      else {
        reply.header("Content-Type", "application/json");
        return reply.status(200).send({
          redisKey,
          redisResponse
        }); // json com o log;
      }
    }

    // recupera o backup do banco de dados
    const response = await getBackup(db, +backupId);
    const backup = response?.data as unknown as BackupResponse
    if (!backup) {
      return reply.status(400).send({ message: 'Level not found' });
    }

    // aplicar regras de validação do CSV
    const { isError, backupWithErrors } = applyBusinessRules(backup.csvModel); 
    if (isError) {
      return reply.status(400).send(backupWithErrors);
    }

    // busca o level que vai entrar e o level que vai sair
    const levels = await getLevels(db, backup.csvModel, +levelId);
    
    // seta no level os elementos a serem excluidos;
    elementsForDeletion(levels.levelIn, levels.levelOut);

    // seta no level os alementos a serem criados
    elementsForCreation(levels.levelIn, levels.levelOut);
    
    // seta no level os elementeos a serem atualizados
    elementsForUpdation(levels.levelIn, levels.levelInNow);

    // caso a requisição demore mais que meio minuto o servidor devolve uma mensagem que será processado em segundo plano
    let flag = true;
    setTimeout(() => {
      if (flag) {
        workInRedis(redis).setInProcess(redisKey);
        reply?.status(202).send({ message: 'Seu pedido de restauração está sendo processado em segundo plano' });
        flag = false;
      }
    }, 30000); 

    // então, executa as transacoes garantindo que todas tenham exito.
    try {
      await executeTransactions(db, levels.levelIn, levels.levelInNow, levels.levelOut);
    } catch (e: any) {
      if (flag) {
        flag = false;
        workInRedis(redis).remove(redisKey);
        return reply.status(500).send({ message: `aconteceu um erro inesperado: ${e?.sqlMessage}` });
      } else {
        workInRedis(redis).setLog(redisKey, `aconteceu um erro inesperado: ${e?.sqlMessage}`);
      }
    }
    // um obheto de log com os ids de cada alteracao.
    const log = logFactory(levels.levelIn, levels.levelOut);

    // seta o log no redis para consulta
    !flag && workInRedis(redis).setLog(redisKey, log);

    // indica que executou abaixo do tempo esperado e retorn o log deretamente mente
    flag && reply.status(200).send(log);
    
    // setando flag como false indica que a requisição foi respondida com sucesso.
    flag = false;
  }

  return { createBackup, restoreBackupFronDB };
}