import { FastifyReply, FastifyRequest } from "fastify";
import { Redis } from "ioredis";
import { parse } from "json2csv";

import { getLevelById } from "../../../shared/repositories/level.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { Environment } from "../../../shared/types/environment.type";
import { 
  applyBusinessRules,
  BackupResponse,
  generateBackup,
  getBackup,
  saveBackup,
  getLevels,
  elementsForDeletion,
  elementsForCreation,
  elementsForUpdation,
  executeTransactions
} from "../services/backup.service";


interface IParams {
  levelId?: string;
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

  const restoreBackupFronDB = async (req: FastifyRequest, reply: FastifyReply) => {
    const idBackup = 5; // id do backup
    const idLevel = 7; // id do level onde vai ser restaurado o backup;

    // recupera o backup do banco de dados
    const response = await getBackup(db, idBackup);
    const backup = response?.data as BackupResponse
    if (!backup) {
      return reply.status(400).send({ message: 'Level not found' });
    }

    // excluir essa parte --------------------------------------------------
    console.log('antes', backup.csvModel.length);
    // backup.csvModel.splice(0, 2);
    console.log('depois', backup.csvModel.length);
    // backup.csvModel.push({
    //   levelId: 1,
    //   themeId: 327,
    //   themeOrder: 0,
    //   cycleId: 1260,
    //   cycleName: 'novo ciclo teste',
    //   cycleOrder: 1,
    //   activityId: undefined,
    //   activityOrder: 3,
    //   activityName: 'Nova atividade teste 2',
    //   activityEstimatedTime: '2 minutes',
    //   activityDescription: 'isso é um teste',
    //   activityEmbeddedHeight: 2000,
    //   activityEmbeddedUrl: 'http://teste.com',
    // } as any);
    // ---------------------------------------------------------------------

    // aplica a regra de negocio para validar o csv
    const { isError, backupWithErrors } = applyBusinessRules(backup.csvModel); 
    if (isError) {
      return reply.status(400).send(backupWithErrors);
    }

    // busca o level que vai entrar e o level que vai sair
    const levels = await getLevels(db, backup.csvModel, idLevel);
    
    // seta no level os elementos a serem excluidos;
    elementsForDeletion(levels.levelIn, levels.levelOut);

    // seta no level os alementos a serem criados
    elementsForCreation(levels.levelIn);
    
    // seta no level os elementeos a serem atualizados
    elementsForUpdation(levels.levelIn, levels.levelInNow);

    // então, executa as acoes referente a cada elements array
    const apagar = await executeTransactions(db, levels.levelIn, levels.levelInNow, levels.levelOut);

    return reply.send(apagar);
  }

  return { createBackup, restoreBackupFronDB };
}

export const backupLevelControllerOld = (
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