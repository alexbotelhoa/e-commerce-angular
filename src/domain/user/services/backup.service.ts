/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redis } from "ioredis";
import { parse } from "json2csv";

import { EmbeddedActivityDataEntity } from "../../../entities/activities/embedded-activity-data.entity";
import { ActivityEntity } from "../../../entities/activity.entity";
import { BackupEntity } from "../../../entities/backup.entity";
import { CycleActivityEntity } from "../../../entities/cycle-activity.entity";
import { CycleEntity } from "../../../entities/cycle.entity";
import { LevelThemeEntity } from "../../../entities/level-theme.entity";
import { LevelEntity } from "../../../entities/level.entity";
import { insertActivity, selectActivity, updateActivity } from "../../../shared/repositories/activity.repository";
import { getBackupById, insertBackup } from "../../../shared/repositories/backup.repository";
import { deleteCycleActivity, insertCycleActivity, selectCycleActivity, updateCycleActivity } from "../../../shared/repositories/cycle-activity.repository";
import { deleteCycle, insertCycle, selectCycle, updateCycle } from "../../../shared/repositories/cycle.repository";
import { insertEmbeddedActivityData, selectEmbeddedActivityData, updateEmbeddedActivityData } from "../../../shared/repositories/embedded-activity-data.repository";
import { deleteLevelTheme, insertLevelTheme, selectLevelTheme, updateLevelTheme } from "../../../shared/repositories/level-theme.repository";
import { getLevelById } from "../../../shared/repositories/level.repository";
import { DatabaseService } from "../../../shared/services/database.service";


interface IActions {
  isSave?: boolean;
  isUpdate?: boolean;
  isDelete?: boolean;
}
interface ILevel extends LevelEntity {
  level_themes: ILeveltheme[];
}

interface ILeveltheme extends LevelThemeEntity, IActions {
  cycles?: ICycle[];
}

interface ICycle extends CycleEntity, IActions {
  cycle_activities?: ICycleActivity[];
}

interface ICycleActivity extends CycleActivityEntity, IActions {
  activity?: IActivity;
  cycle?: ICycle;
}

interface IActivity extends ActivityEntity, IActions {
  embedded_activity_data: EmbeddedActivityDataEntity;
}

export interface ILog {
  levelTheme: ILogResult;
  cycle: ILogResult;
  cycleActivity: ILogResult;
  activity: ILogResult;
}

interface ILogResult { 
  create: number [];
  update: number[];
  delete: number[];
}

interface GenericHash<T = any> {
    [key: string]: T
}

// aplicar os indefineds
export interface IBackupCSV {
    levelId: number;
    levelThemeId?: number;
    themeId: number;
    themeOrder: number;
    cycleId: number;
    cycleOrder: number;
    cycleName: string;
    cycleActivityId?: number;
    activityId: number;
    activityOrder: number;
    activityName: string;
    activityDescription: string | null;
    activityEstimatedTime: string;
    activityEmbeddedUrl: string;
    activityEmbeddedHeight: number;
}
export interface IBackupJSON {
    level: LevelEntity | null;
    levelThemes: LevelThemeEntity[];
    cycles: CycleEntity[];
    cycleActivity: CycleActivityEntity[];
    activityList: ActivityEntity[];
    activityDataEmbedded: EmbeddedActivityDataEntity[];
}

// export type BackupResponse = {csvModel: IBackupCSV[], entities: IBackupJSON};



function transformArrayToHashTable<T>(array: T[], key: keyof T): GenericHash<T> {
  return array.reduce((acc, value) => {
      if (!acc[value[key]]) {
          acc[value[key]] = {}
      }
      acc[value[key]] = value;
      return acc;
  }, {} as any)
}

function getElementInLevel<T>(
  element: "cycle" | "activity" | "cycleActivity" | "levelTheme" | 'embedded',
  level: ILevel
): T[] {
  if (element === "cycle") {
    const cycles: ICycle[] = [];
    level.level_themes?.forEach((lt) => {
      lt.cycles?.forEach(c => {
        cycles.push({
          id: c.id,
          levelThemeId: c.levelThemeId,
          name: c.name,
          order: c.order,
          active: c.active
        } as ICycle)
      });
    });
    return cycles as unknown as T[];
  } 
  else if (element === "activity") {
    const activities: IActivity[] = [];
    level.level_themes?.forEach((lt) => {
      lt.cycles?.forEach((c) => {
        c.cycle_activities?.forEach((ca) => {
          ca.activity && activities.push(ca.activity);
        });
      });
    });
    return activities as unknown as T[];
  } 
  else if (element === "embedded") {
    const embeddeds: EmbeddedActivityDataEntity[] = [];
    level.level_themes?.forEach((lt) => {
      lt.cycles?.forEach((c) => {
        c.cycle_activities?.forEach((ca) => {
          ca.activity && embeddeds.push({
            activityId: ca.activity.id,
            height: ca.activity.embedded_activity_data.height,
            url: ca.activity.embedded_activity_data.url
          });
        });
      });
    });
    return embeddeds as unknown as T[];
  } 
  else if (element === 'cycleActivity') {
    const cycleActivity: ICycleActivity[] = [];
    level.level_themes?.forEach(lt => {
      lt.cycles?.forEach(c => {
        c.cycle_activities?.forEach(ca => {
          cycleActivity.push({
            id: ca.id, 
            cycleId: ca.cycleId,
            activityId: ca.activityId,
            order: ca.order
          } as ICycleActivity);
        });
      });
    });
    return cycleActivity as unknown as T[];
  }
  else if (element === 'levelTheme') {
    const levelTheme: ILeveltheme[] = [];
    level.level_themes?.forEach(lt => {
      levelTheme.push({
        id: lt.id,
        levelId: lt.levelId,
        themeId: lt.themeId,
        order: lt.order
      } as ILeveltheme);
    });
    return levelTheme as unknown as T[];
  }
  return [] as T[];
}

function backupToLevel(backupCSV: IBackupCSV[]): ILevel {
  return backupCSV.reduce((acc, line) => {
    const levelTheme = {
      levelId: line.levelId,
      id: line.levelThemeId,
      order: line.themeOrder,
      themeId: line.themeId,
      cycles: []
    } as ILeveltheme;

    const cycle = {
      id: line.cycleId,
      levelThemeId: line.themeId,
      name: line.cycleName,
      order: line.cycleOrder,
      cycle_activities: [],
      active: true
    } as ICycle;

    const activity: IActivity = {
      id: line.activityId,
      name: line.activityName,
      description: line.activityDescription,
      active: true,
      typeId: 1,
      estimatedTime: line.activityEstimatedTime,
      embedded_activity_data: {
        activityId: line.activityId,
        height: line.activityEmbeddedHeight,
        url: line.activityEmbeddedUrl
      }
    }

    const cycleActivities = {
      id: line.cycleActivityId,
      activityId: activity.id,
      cycleId: cycle.id,
      order: line.activityOrder,
      activity
    } as ICycleActivity;

    if (acc.id) {
      const hasLevelTheme = acc.level_themes?.find(item => item.themeId === line.themeId);
      if (hasLevelTheme) {
        const hasCycle = hasLevelTheme.cycles?.find(item => item.id === cycle.id);

        if (hasCycle) {
          hasCycle.cycle_activities?.push(cycleActivities);
        } else {
          cycle.cycle_activities?.push(cycleActivities);
          hasLevelTheme.cycles?.push(cycle);
        }
      } else {
        cycle.cycle_activities?.push(cycleActivities);
        levelTheme.cycles?.push(cycle);
        acc.level_themes?.push(levelTheme)
      }
    } else {
      cycle.cycle_activities?.push(cycleActivities);
      levelTheme.cycles?.push(cycle);
      acc = {
        id: +line.levelId,
        level_themes: [levelTheme]
      } as ILevel;
    }
    return acc;
  }, {} as ILevel);
}


// services para gerar backup -----------------------------------------------------------------------------------------------
export const generateBackup = async (readonlyDatabase: DatabaseService, levelId: string): Promise<IBackupCSV[]> => {
    const level = await getLevelById(readonlyDatabase)(levelId);

    const levelThemes = await selectLevelTheme(readonlyDatabase).where('levelId', levelId);
    const levelThemesIds = levelThemes.map(data => data.id);
    // const levelThemesHash = transformArrayToHashTable(levelThemes, 'id');

    const cycles = await selectCycle(readonlyDatabase).whereIn('levelThemeId', levelThemesIds);
    const cyclesIds = cycles.map(data => data.id);
    // const cyclesHash = transformArrayToHashTable(cycles, 'id');
    
    const cycleActivity = await selectCycleActivity(readonlyDatabase).whereIn('cycleId', cyclesIds);
    // const cycleActivityHash = transformArrayToHashTable(cycleActivity, 'activityId');

    const activityIds = cycleActivity.map(data => data.activityId);
    const activityList = await selectActivity(readonlyDatabase).whereIn('id', activityIds);
    // const activityHash = transformArrayToHashTable(activityList, 'id');
    
    const activityDataEmbedded = await selectEmbeddedActivityData(readonlyDatabase).whereIn('activityId', activityIds);
    // const activityDataEmbeddedHash = transformArrayToHashTable(activityDataEmbedded, 'activityId');  

    const backup: IBackupCSV[] = [];

    if (!levelThemes.length) {
      backup.push({
          levelId: level?.id,
          levelThemeId: '',
          themeId : '',
          themeOrder: '',
          cycleId: '',
          cycleOrder: '',
          cycleName: '',
          cycleActivityId: '',
          activityId: '',
          activityOrder: '',
          activityName: '',
          activityDescription: '',
          activityEstimatedTime: '',
          activityEmbeddedUrl: '',
          activityEmbeddedHeight: '',
        } as unknown as IBackupCSV);
    }

    levelThemes.forEach(lt => {
      const line = {} as IBackupCSV;
      line.levelId = lt.levelId;
      line.levelThemeId = lt.id;
      line.themeId = lt.themeId;
      line.themeOrder = lt.order;

      const cyclesFiltred = cycles.filter(c => c.levelThemeId === lt.id);
      if (!cyclesFiltred.length) {
        line.cycleId = '' as any;
        line.cycleOrder = '' as any;
        line.cycleName = '' as any;
        line.cycleActivityId = '' as any;
        line.activityId = '' as any;
        line.activityOrder = '' as any;
        line.activityName = '' as any;
        line.activityDescription = '' as any;
        line.activityEstimatedTime = '' as any;
        line.activityEmbeddedUrl = '' as any;
        line.activityEmbeddedHeight = '' as any;
        backup.push({ ...line });
        return;
      }
      cyclesFiltred.forEach(c => {
        line.cycleId = c.id;
        line.cycleOrder = c.order;
        line.cycleName = c.name;

        const cycleActivityFiltred = cycleActivity.filter(ca => ca.cycleId === c.id);
        if (!cycleActivityFiltred.length) {
          line.cycleActivityId = '' as any;
          line.activityId = '' as any;
          line.activityOrder = '' as any;
          line.activityName = '' as any;
          line.activityDescription = '' as any;
          line.activityEstimatedTime = '' as any;
          line.activityEmbeddedUrl = '' as any;
          line.activityEmbeddedHeight = '' as any;
          backup.push({ ...line });
          return;
        }
        cycleActivityFiltred.forEach(ca => {
          line.cycleActivityId = ca.id;
          
          const activityListFiltred = activityList.filter(a => a.id === ca.activityId);
          if (!activityListFiltred.length) {
            line.activityId = '' as any;
            line.activityOrder = '' as any;
            line.activityName = '' as any;
            line.activityDescription = '' as any;
            line.activityEstimatedTime = '' as any;
            line.activityEmbeddedUrl = '' as any;
            line.activityEmbeddedHeight = '' as any;
            backup.push({ ...line });
            return;
          }
          activityList.filter(a => a.id === ca.activityId).forEach(a => {
            line.activityId = a.id;
            line.activityOrder = ca.order;
            line.activityName = a.name;
            line.activityDescription = a.description;
            line.activityEstimatedTime = a.estimatedTime;

            const embedded = activityDataEmbedded.find(ae => ae.activityId === a.id);
            if (embedded) {
              line.activityEmbeddedUrl = embedded?.url;
              line.activityEmbeddedHeight = embedded?.height;
            }
            backup.push({ ...line });
          });
        });
      });
    });

    // const backupOld = activityIds.map(activity => {
    //     const cycleId = cycleActivityHash[activity].cycleId;
    //     const levelThemeId = cyclesHash[cycleId].levelThemeId
    //     const levelThemeHash = levelThemesHash[levelThemeId]
    //     return  {
    //         levelId: level?.id,
    //         levelThemeId: levelThemeHash.id, // <-validar com o ivan
    //         themeId : levelThemeHash.themeId,
    //         themeOrder: levelThemeHash.order,
    //         cycleId: cycleId,
    //         cycleOrder: cyclesHash[cycleId].order,
    //         cycleName: cyclesHash[cycleId].name,
    //         cycleActivityId: cycleActivityHash[activity].id, // <-validar com o ivan
    //         activityId: activityHash[activity].id,
    //         activityOrder: cycleActivityHash[activity].order,
    //         activityName: activityHash[activity].name,
    //         activityDescription: activityHash[activity].description,
    //         activityEstimatedTime: activityHash[activity].estimatedTime,
    //         activityEmbeddedUrl: activityDataEmbeddedHash[activity].url,
    //         activityEmbeddedHeight: activityDataEmbeddedHash[activity].height,
    //     } as IBackupCSV;
    // })

    backup
      .sort((a, b) => a.activityOrder - b.activityOrder)
      .sort((a, b) => a.cycleOrder - b.cycleOrder)
      .sort((a, b) => a.themeOrder - b.themeOrder);

    // return {
    //     csvModel: backup,
    //     entities: {
    //         level,
    //         levelThemes,
    //         cycles,
    //         cycleActivity,
    //         activityList,
    //         activityDataEmbedded
    //     }
    // }

    return backup;
}

export async function saveBackup(backup: IBackupCSV[], db: DatabaseService, nameBackup: string): Promise<void> {
    await insertBackup(db)({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: nameBackup,
        data: JSON.stringify(backup) as any,
        type: "level"
    })
}

export async function generateCsv(backup: IBackupCSV[]): Promise<string> {
    return parse(backup);
}



// services para restaurar backup --------------------------------------------------------------------------------------------
export const getLevel = (db: DatabaseService, levelId: number): Promise<LevelEntity | null> => {
  return getLevelById(db)(levelId);
}

export const getBackup = ( db: DatabaseService, id: number): Promise<BackupEntity | null> => {
  return getBackupById(db)(id);
}

export const applyBusinessRules = (backup: IBackupCSV[]): { isError: boolean, backupWithErrors: (IBackupCSV & { error?: string } )[]} => {
  // aqui vai aplicar todas as regras de validação;

  // verificar se só tem um level no csv
  // verifica se o nivel existe

  // extrair todos os ids de ciclo
  // fazer um consulta e verificar se os ids existem no banco, os que não existirem inserir em um array os que devem ser criados

  // extrair todos os ids das atividades
  // fazer um consulta e verificar se os ids existem no banco, os que não existirem inserir em um array os que devem ser criados

  return {
    isError: false,
    backupWithErrors: backup
  };
}

export const getLevels = async (
  db: DatabaseService,
  backupIn: IBackupCSV[],
  idLevelOut: number
): Promise<{ levelIn: ILevel; levelInNow: ILevel; levelOut: ILevel }> => {
  const backupInNow = await generateBackup(db, (backupIn[0].levelId || 0).toString());
  const backupOut = await generateBackup(db, idLevelOut.toString());
  const levelIn = backupToLevel(backupIn);
  const levelInNow = backupToLevel(backupInNow);
  const levelOut = backupToLevel(backupOut);
  return { levelIn, levelInNow, levelOut };
};

export const elementsForDeletion = (levelIn: ILevel, levelOut: ILevel): void => {
  const cyclesIn = getElementInLevel<ICycle>('cycle', levelIn);
  const activitiesIn = getElementInLevel<IActivity>('activity', levelIn);

  levelOut?.level_themes?.map(lt => {
    lt.cycles?.map(c => {
      const isCycleIn = cyclesIn.find(cin => cin.id === c.id);
      if (!isCycleIn) {
        c.isDelete = true;
      }

      c.cycle_activities?.map(ca => {
        const isActivityIn = activitiesIn.find(ain => ain.id === ca.activityId);
        if (!isActivityIn) {
          ca.isDelete = true;
        }
      });
    });

    const isRemoveLevelTheme = lt.cycles?.filter(c => c.isDelete).length === lt.cycles?.length;
    if (isRemoveLevelTheme) {
      lt.isDelete = true;
    }
  });
}

export const elementsForCreation = (levelIn: ILevel, levelOut: ILevel): void => {
  const isMesmoLevel = levelIn.id === levelOut.id;
  const levelThemesOut = getElementInLevel<ILeveltheme>('levelTheme', levelOut);
  const cyclesOut = getElementInLevel<ICycle>('cycle', levelOut);
  const cycleActivitiesOut = getElementInLevel<ICycleActivity>('cycleActivity', levelOut);

  levelIn.level_themes?.map(lt => {
    const lto = levelThemesOut.find(lto => lto.id === lt.id);
    if (!isMesmoLevel || !lto) {
      // @ts-ignore
      lt.id = undefined
      lt.isSave = true;
    }

    lt.cycles?.map(c => {
      const co = cyclesOut.find(co => co.id === c.id);
      if (!isMesmoLevel || c.id === undefined || !co) {
        // @ts-ignore
        c.id = undefined; c.levelThemeId = lt.id;
        c.isSave = true;
      }

      c.cycle_activities?.map(ca => {
        const cao = cycleActivitiesOut.find(cao => cao.id === ca.id);
        if (!isMesmoLevel || !cao) {
          // @ts-ignore
          ca.id = undefined; ca.cycleId = undefined;
          ca.isSave = true;
        }

        if (ca.activity && ca.activity?.id === undefined) {
          // @ts-ignore
          ca.activity.id = undefined;
          ca.activity.isSave = true;
        }
      });
    });
  });
}

export const elementsForUpdation = (levelIn: ILevel, levelInNow: ILevel): void => {
  const levelThemesNow = getElementInLevel<ILeveltheme>('levelTheme', levelInNow);
  const cyclesNow = getElementInLevel<ICycle>('cycle', levelInNow);
  const cyclesActivitiesNow = getElementInLevel<ICycleActivity>('cycleActivity', levelInNow);
  const activitiesNow = getElementInLevel<IActivity>('activity', levelInNow);
  const embeddedsNow = getElementInLevel<EmbeddedActivityDataEntity>('embedded', levelInNow);

  for (const lt of levelIn.level_themes) {
    // verifica se o levelTheme tem alteracoes;
    const levelThemeNow = levelThemesNow.find(ltn => ltn.id === lt.id)
    if (levelThemeNow) {
      const comparationA = lt.order;
      const comparationB = levelThemeNow.order;

      if (comparationA !== comparationB) {
        lt.isUpdate = true;
      }
    }

    for (const cycle of lt.cycles || []) {
      // verifica se o cyclo tem alteracoes
      const cycleNow = cyclesNow.find(cn => cn.id === cycle.id);
      if (cycleNow) {
        const comparationA = JSON.stringify({
          name: cycle.name,
          order: cycle.order
        });

        const comparationB = JSON.stringify({
          name: cycleNow.name,
          order: cycleNow.order
        });

        if (comparationA !== comparationB) {
          cycle.isUpdate = true;
        }
      }

      for (const ca of cycle.cycle_activities || []) {
        if (ca.activityId && ca.cycleId) {
          const caNow = cyclesActivitiesNow.find(can => can.id === ca.id);
          if (caNow) {
            const comparationA = ca.order;
            const comparationB = caNow.order;
            if (comparationA !== comparationB) {
              ca.isUpdate = true;
            }
          }
        }

        const activityNow = activitiesNow.find((an) => an.id === ca.activityId);
        const embeddedNow = embeddedsNow.find(
          (an) => an.activityId === ca.activityId
        );
        if (activityNow && embeddedNow && ca.activity) {
          const comparationA = JSON.stringify({
            name: activityNow.name,
            description: activityNow.description,
            estimatedTime: activityNow.estimatedTime,
            height: embeddedNow.height,
            url: embeddedNow.url,
          });

          const comparationB = JSON.stringify({
            name: ca.activity?.name,
            description: ca.activity?.description,
            estimatedTime: ca.activity?.estimatedTime,
            height: ca.activity?.embedded_activity_data.height,
            url: ca.activity?.embedded_activity_data.url,
          });

          if (comparationA !== comparationB) {
            ca.activity.isUpdate = true;
          }
        }
      }
    }
  }
}

export const logFactory = (levelIn: ILevel, levelOut: ILevel): ILog => {
  const log: ILog = {
    levelTheme: {
      create: [],
      update: [],
      delete: []
    },
    cycleActivity: {
      create: [],
      update: [],
      delete: []
    },
    cycle: {
      create: [],
      update: [],
      delete: []
    },
    activity: {
      create: [],
      update: [],
      delete: []
    }
  }

  levelIn.level_themes.forEach(lt => {
    lt.isSave && log.levelTheme.create.push(lt.id);
    lt.isUpdate && log.levelTheme.update.push(lt.id);
    lt.cycles?.forEach(c => {
      c.isSave && log.cycle.create.push(c.id);
      c.isUpdate && log.cycle.update.push(c.id);
      c.cycle_activities?.forEach(ca => {
        ca.isSave && log.cycleActivity.create.push(ca.id);
        ca.isUpdate && log.cycleActivity.update.push(ca.id);
        ca.activity?.isSave && log.activity.create.push(ca.activity.id);
        ca.activity?.isUpdate && log.activity.update.push(ca.activity.id);
      });
    });
  });

  levelOut.level_themes.forEach(lt => {
    lt.isDelete && log.levelTheme.delete.push(lt.id);
    lt.cycles?.forEach(c => {
      c.isDelete && log.cycle.delete.push(c.id);
      c.cycle_activities?.forEach(ca => {
        ca.isDelete && log.cycleActivity.delete.push(ca.id);
      });
    });
  });

  return log;
}

export const executeTransactions = async (db: DatabaseService, levelIn: ILevel, levelInNow: ILevel, levelOut: ILevel): Promise<any> => {
  console.log('\nTransactions iniciadas\n');

  const forDelete: any[] = [];
  levelOut.level_themes?.forEach(lt => {
    if (lt.isDelete) {
      forDelete.push({ levelTheme: lt.id });
    }
    lt.cycles?.forEach(c => {
      if (c.isDelete) {
        forDelete.push({ cycle: c.id });
      }
      c.cycle_activities?.forEach(ca => {
        if (ca.isDelete) {
          forDelete.push({ cycleActivity: ca.id });
        }
      });
    });
  });

  const deleteGrouped = forDelete.reduce((acc, item) => {
    item['cycle'] && acc.cycles.push(item['cycle']);
    item['cycleActivity'] && acc.cycleActivities.push(item['cycleActivity']);
    item['levelTheme'] && acc.levelThemes.push(item['levelTheme']);
    return acc;
  }, { cycles: [], cycleActivities: [], levelThemes: [] });

  await db.transaction(async scope => {
    deleteGrouped.cycleActivities.length && await deleteCycleActivity(scope)(builder => 
      builder.whereIn('id', deleteGrouped.cycleActivities)
    );

    deleteGrouped.cycles.length && await deleteCycle(scope)(builder => 
      builder.whereIn('id', deleteGrouped.cycles)
    );

    deleteGrouped.levelThemes.length && await deleteLevelTheme(scope)(builder => 
      builder.whereIn('id', deleteGrouped.levelThemes)
    );

    levelIn.id = levelOut.id || levelIn.id;
    for (const levelTheme of levelIn.level_themes || []) {
      if (levelTheme.isSave) {
        levelTheme.levelId = levelIn.id;
        levelTheme.id = await insertLevelTheme(scope)({
          levelId: levelTheme.levelId,
          themeId: levelTheme.themeId,
          order: levelTheme.order
        } as LevelThemeEntity);
      }

      if (levelTheme.isUpdate) {
        await updateLevelTheme(scope)({
          order: levelTheme.order
        })(builder =>
          builder.andWhere('id', levelTheme.id)
        );
      }

      for (const cycle of levelTheme.cycles || []) {
        if (cycle.isSave) {
          cycle.id = await insertCycle(scope)({
            name: cycle.name,
            order: cycle.order,
            levelThemeId: levelTheme.id,
            active: cycle.active
          } as CycleEntity);
        }

        if (cycle.isUpdate) {
          await updateCycle(scope)({
            name: cycle.name,
            order: cycle.order,
            active: cycle.active
          })(builder => 
            builder.andWhere('id', cycle.id)
          );
        }

        for (const cycleActivity of cycle.cycle_activities || []) {
          if (cycleActivity?.activity?.isSave) {
            cycleActivity.activity.id = await insertActivity(scope)({
              name: cycleActivity.activity.name,
              description: cycleActivity.activity.description,
              estimatedTime: cycleActivity.activity.estimatedTime,
              typeId: cycleActivity.activity.typeId,
              active: cycleActivity.activity.active
            } as ActivityEntity);

            await insertEmbeddedActivityData(scope)({
              activityId: cycleActivity.activity.id,
              height: cycleActivity.activity.embedded_activity_data.height,
              url: cycleActivity.activity.embedded_activity_data.url
            } as EmbeddedActivityDataEntity);

            cycleActivity.activity.embedded_activity_data.activityId = cycleActivity.id;
            cycleActivity.activityId = cycleActivity.activity.id;
          }

          if (cycleActivity?.activity?.isUpdate) {
            await updateActivity(scope)({
              name: cycleActivity.activity.name,
              description: cycleActivity.activity.description,
              estimatedTime: cycleActivity.activity.estimatedTime,
              active: cycleActivity.activity.active
            })(builder => 
              builder.andWhere('id', cycleActivity.activity?.id)
            );

            await updateEmbeddedActivityData(scope)({
              height: cycleActivity.activity.embedded_activity_data.height,
              url: cycleActivity.activity.embedded_activity_data.url
            })(builder => 
              builder.andWhere('activityId', cycleActivity.activity?.id )
            );
          }

          if (cycleActivity.isSave) {
            cycleActivity.cycleId = cycle.id; 
            cycleActivity.id = await insertCycleActivity(scope)({
              cycleId: cycleActivity.cycleId,
              activityId: cycleActivity.activityId,
              order: cycleActivity.order
            } as CycleActivityEntity);
          }

          if (cycleActivity.isUpdate) {
            await updateCycleActivity(scope)({
              order: cycleActivity.order
            })(builder =>
              builder.andWhere('id', cycleActivity.id)
            );
          }
        }
      }
    }
  });
  console.log('\nTransactions finalizadas\n');
}

export function workInRedis(
  redis: Redis,
): {
  setInProcess: (redisKey: string) => void;
  remove: (redisKey: string) => void;
  setLog: (redisKey: string, log: ILog | string) => void;
  get: (redisKey: string) => Promise<ILog | 'inProcess' | undefined>;
} {
  function setInProcess(redisKey: string) {
    redis.set(redisKey, 'inProcess', 'ex', 3600); // 1 hora
  }

  function remove(redisKey: string) {
    redis.del(redisKey);
  }

  function setLog(redisKey: string, log: ILog | string) {
    const data = JSON.stringify(log);
    redis.set(redisKey, data, 'ex', 3600); // 1 hora
  }

  async function get(redisKey: string) {
    const response = await redis.get(redisKey);
    if (response === "inProcess") {
      return response;
    }

    const log = response && JSON.parse(response);
    if (log && log.length > 0) {
      await redis.del(redisKey);
      return log as ILog;
    }
    return undefined;
  }

  return { setInProcess, setLog, get, remove };
}