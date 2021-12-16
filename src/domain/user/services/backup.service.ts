/* eslint-disable @typescript-eslint/no-explicit-any */
import { number } from "io-ts";
import { parse } from "json2csv";
import Knex from "knex";

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
import { deleteLevelTheme, selectLevelTheme, updateLevelTheme } from "../../../shared/repositories/level-theme.repository";
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

interface IElementsBD {
  activitiesBD: IActivity[];
  cyclesBD: ICycle[];
  cycleActivitiesBD: ICycleActivity[];
}

interface IElementsBackup {
  activitiesBackup: IActivity[];
  cycleActivitiesBackup: ICycleActivity[];
  cyclesBackup: ICycle[];
}

interface GenericHash<T = any> {
    [key: string]: T
}

// aplicar os indefineds
export interface IBackupCSV {
    levelId: number;
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

export type BackupResponse = {csvModel: IBackupCSV[], entities: IBackupJSON};



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
    level.level_themes.forEach((lt) => {
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
    level.level_themes.forEach((lt) => {
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
    level.level_themes.forEach((lt) => {
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
    level.level_themes.forEach(lt => {
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
    level.level_themes.forEach(lt => {
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
    const levelTheme: ILeveltheme = {
      levelId: line.levelId,
      id: line.themeId,
      order: line.themeOrder,
      themeId: line.themeId,
      cycles: []
    }

    const cycle: ICycle = {
      id: line.cycleId,
      levelThemeId: line.themeId,
      name: line.cycleName,
      order: line.cycleOrder,
      cycle_activities: [],
      active: true
    } 

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
      order: line.cycleOrder,
      activity
    } as ICycleActivity;

    if (acc.id) {
      const hasLevelTheme = acc.level_themes.find(item => item.themeId === line.themeId);
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
        acc.level_themes.push(levelTheme)
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
export const generateBackup = async (readonlyDatabase: DatabaseService, levelId: string): Promise<BackupResponse> => {
    const level = await getLevelById(readonlyDatabase)(levelId);

    const levelThemes = await selectLevelTheme(readonlyDatabase).where('levelId', levelId);
    const levelThemesIds = levelThemes.map(data => data.id);
    const levelThemesHash = transformArrayToHashTable(levelThemes, 'id');

    const cycles = await selectCycle(readonlyDatabase).whereIn('levelThemeId', levelThemesIds);
    const cyclesIds = cycles.map(data => data.id);
    const cyclesHash = transformArrayToHashTable(cycles, 'id');
    
    const cycleActivity = await selectCycleActivity(readonlyDatabase).whereIn('cycleId', cyclesIds);
    const cycleActivityHash = transformArrayToHashTable(cycleActivity, 'activityId');

    const activityIds = cycleActivity.map(data => data.activityId);
    const activityList = await selectActivity(readonlyDatabase).whereIn('id', activityIds);
    const activityHash = transformArrayToHashTable(activityList, 'id');
    
    const activityDataEmbedded = await selectEmbeddedActivityData(readonlyDatabase).whereIn('activityId', activityIds);
    const activityDataEmbeddedHash = transformArrayToHashTable(activityDataEmbedded, 'activityId');  

    const backup = activityIds.map(activity => {
        const cycleId = cycleActivityHash[activity].cycleId;
        const levelThemeId = cyclesHash[cycleId].levelThemeId
        const levelThemeHash = levelThemesHash[levelThemeId]
        return {
            levelId: level?.id,
            themeId : levelThemeHash.themeId,
            themeOrder: levelThemeHash.order,
            cycleId: cycleId,
            cycleOrder: cyclesHash[cycleId].order,
            cycleName: cyclesHash[cycleId].name,
            cycleActivityId: cycleActivityHash[activity].id, // <-validar com o ivan
            activityId: activityHash[activity].id,
            activityOrder: cycleActivityHash[activity].order,
            activityName: activityHash[activity].name,
            activityDescription: activityHash[activity].description,
            activityEstimatedTime: activityHash[activity].estimatedTime,
            activityEmbeddedUrl: activityDataEmbeddedHash[activity].url,
            activityEmbeddedHeight: activityDataEmbeddedHash[activity].height,
        } as IBackupCSV;
    })

    backup.sort((a, b) => a.activityOrder - b.activityOrder).sort((a, b) => a.cycleOrder - b.cycleOrder).sort((a, b) => a.themeOrder - b.themeOrder);

    return {
        csvModel: backup,
        entities: {
            level,
            levelThemes,
            cycles,
            cycleActivity,
            activityList,
            activityDataEmbedded
        }
    }
}

export async function saveBackup(backup: BackupResponse, db: DatabaseService, nameBackup: string): Promise<void> {
    await insertBackup(db)({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: nameBackup,
        data: JSON.stringify(backup) as any,
        type: "level"
    })
}

export async function generateCsv(backup: BackupResponse): Promise<string> {
    return parse(backup.csvModel);
}



// services para restaurar backup --------------------------------------------------------------------------------------------
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
  const backupInNow = (await generateBackup(db, (backupIn[0].levelId || 0).toString())).csvModel;
  const backupOut = (await generateBackup(db, idLevelOut.toString())).csvModel;
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

export const elementsForCreation = (levelIn: ILevel): void => {
  levelIn.level_themes.map(lt => {
    lt.cycles?.map(c => {
      if (c.id === undefined) {
        c.isSave = true;
      }
      c.cycle_activities?.map(ca => {
        if (ca.activity && ca.activity?.id === undefined) {
          ca.isSave = true;
          ca.activity.isSave = true;
        }
      });
    });
  });
}

export const elementsForUpdationOld = async (db: DatabaseService, levelIn: ILevel): Promise<void> => {
  const idsLevelThemes = levelIn.level_themes.map(lt => lt.id);
  const cyclesNow = await selectCycle(db).whereIn('levelThemeId', idsLevelThemes) as ICycle[];

  const idsActivities: number[] = [];
  levelIn.level_themes.forEach(lt => lt.cycles?.forEach(c => c.cycle_activities?.forEach(ca => ca.activityId && idsActivities.push(ca.activityId))));
  const activitiesNow = await selectActivity(db).whereIn('id', idsActivities);
  const embeddedsNow = await selectEmbeddedActivityData(db).whereIn('activityId', idsActivities);

  for (const lt of levelIn.level_themes) {
    for (const cycle of lt.cycles || []) {
      // verifica se o cyclo tem alteracoes
      const cycleNow = cyclesNow.find(cn => cn.id === cycle.id);
      if (cycleNow) {
        if (cycleNow.id === 1261) {
          console.log('teste');
        }
        const comparationA = JSON.stringify({
          id: cycle.id,
          name: cycle.name,
          order: cycle.order
        });

        const comparationB = JSON.stringify({
          id: cycleNow.id,
          name: cycleNow.name,
          order: cycleNow.order
        });

        if (comparationA !== comparationB) {
          cycle.isUpdate = true;
        }
      }

      for (const ca of cycle.cycle_activities || []) {
        if (ca.activityId && ca.cycleId) {
          const caNow = await selectCycleActivity(db).where({
            activityId: ca.activityId,
            cycleId: ca.cycleId,
          });
          if (caNow[0]) {
            ca.id = caNow[0].id;
            const comparationA = ca.order;
            const comparationB = caNow[0].order;

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

export const elementsForUpdation = (levelIn: ILevel, levelInNow: ILevel): void => {
  const cyclesNow = getElementInLevel<ICycle>('cycle', levelInNow);
  const cyclesActivitiesNow = getElementInLevel<ICycleActivity>('cycleActivity', levelInNow);
  const activitiesNow = getElementInLevel<IActivity>('activity', levelInNow);
  const embeddedsNow = getElementInLevel<EmbeddedActivityDataEntity>('embedded', levelInNow);

  for (const lt of levelIn.level_themes) {
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
          const caNow = cyclesActivitiesNow.find(can => can.activityId == ca.activityId && can.cycleId === ca.cycleId);
          if (caNow) {
            ca.id = caNow.id;
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

export const executeTransactionsOld = async (db: DatabaseService, levelIn: ILevel, levelOut: ILevel): Promise<any> => {
  const levelThemesForDelete: number[] = [];
  const levelThemesForUpdate: LevelThemeEntity[] = [];

  const cyclesForSave: CycleEntity[] = [];
  const cyclesForUpdate: CycleEntity[] = [];
  const cyclesForDelete: number[] = [];

  const cyclesActivitiesForSave: CycleActivityEntity[] = [];
  const cyclesActivitiesForUpdate: CycleActivityEntity[] = [];
  const cyclesActivitiesForDelete: {cycleId: number, activityId: number}[] = [];

  const activitiesForSave: IActivity[] = [];
  const activitiesForUpdate: ActivityEntity[] = [];

  const embeddedsForUpdate: EmbeddedActivityDataEntity[] = [];

  // extrai os dados que serão ecluidos
  levelOut.level_themes.forEach(lt => {
    if (lt.isDelete) {
      levelThemesForDelete.push(lt.id);
    }
    lt.cycles?.forEach(c => {
      if (c.isDelete) {
        cyclesForDelete.push(c.id);
      }
      c.cycle_activities?.forEach(ca => {
        if (ca.isDelete) {
          cyclesActivitiesForDelete.push({ cycleId: ca.cycleId, activityId: ca.activityId});
        }
      })
    })
  });

  // extrais os dados que serão criados ou alterados
  levelIn.level_themes.forEach(lt => {
    if (lt.isUpdate) {
      levelThemesForUpdate.push({
        // id: lt.id,
        // levelId: lt.levelId,
        order: lt.order,
        // themeId: lt.themeId
      } as LevelThemeEntity);
    }

    lt.cycles?.forEach(c => {
      if (c.isSave) {
        cyclesForSave.push({
          levelThemeId: c.levelThemeId,
          name: c.name,
          order: c.order,
          active: true
        } as CycleEntity);
      }
      if (c.isUpdate) {
        cyclesForUpdate.push({
          id: c.id,
          levelThemeId: c.levelThemeId,
          name: c.name,
          order: c.order,
          active: true
        });
      }

      c.cycle_activities?.forEach(ca => {
        if (ca.isSave) {
          cyclesActivitiesForSave.push({
            cycleId: ca.cycleId,
            activityId: ca.activityId,
            order: ca.order,
          } as CycleActivityEntity);
        }
        if (ca.isUpdate) {
          cyclesActivitiesForUpdate.push({
            id: ca.id,
            cycleId: ca.cycleId,
            activityId: ca.activityId,
            order: ca.order,
          } as CycleActivityEntity);
        }

        if (ca.activity && ca.activity?.isSave) {
          activitiesForSave.push(ca.activity);
        }

        if (ca.activity && ca.activity?.isUpdate) {
          activitiesForUpdate.push({
            id: ca.activity.id,
            name: ca.activity.name,
            description: ca.activity.description,
            estimatedTime: ca.activity.estimatedTime,
            typeId: 1,
            active: true
          } as ActivityEntity);

          embeddedsForUpdate.push({
            activityId: ca.activity.id,
            height: ca.activity.embedded_activity_data.height,
            url: ca.activity.embedded_activity_data.url
          });
        }
        
      });
    });
  });

  let selfScope: Knex.Transaction<any, any> = {} as any;
  try {
    await db.transaction(async scope => {
      const queries: Promise<any>[] = [];
      selfScope = scope;

      // exclusoes-----------------------------------
      queries.push(...cyclesActivitiesForDelete.map(ca => {
        return deleteCycleActivity(scope)(builder => 
          builder
          .andWhere('cycleId', ca.cycleId)
          .andWhere('activityId', ca.activityId)
        );
      }));
      
      queries.push(...cyclesActivitiesForDelete.map(ca => {
        return deleteCycleActivity(scope)(builder => 
          builder
          .andWhere('cycleId', ca.cycleId)
          .andWhere('activityId', ca.activityId)
        );
      }));

      cyclesForDelete.length && queries.push(
        deleteCycle(scope)(builder => 
          builder.whereIn('id', cyclesForDelete)
        )
      );

      levelThemesForDelete.length && queries.push(
        deleteLevelTheme(scope)(builder => 
          builder.whereIn('id', levelThemesForDelete)
        )
      );
      // ---------------------------------------------

      // atualizacoes --------------------------------
      queries.push(...activitiesForUpdate.map(activity => { 
        const data = {
          name: activity.name,
          description: activity.description,
          estimatedTime: activity.estimatedTime,
          active: activity.active
        } as ActivityEntity;
        return updateActivity(scope)(data)(builder => 
          builder.andWhere('id', activity.id)
        );
      }));

      queries.push(...embeddedsForUpdate.map(embedded => {
        const data = {
          height: embedded.height,
          url: embedded.url
        } as EmbeddedActivityDataEntity;
        return updateEmbeddedActivityData(scope)(data)(builder => 
          builder.andWhere('activityId', embedded.activityId)
        );
      }));

      queries.push(...cyclesForUpdate.map(cycle => {
        const data = {
          name: cycle.name,
          order: cycle.order,
          active: cycle.active
        } as CycleEntity;
        return updateCycle(scope)(data)(builder => 
          builder.andWhere('id', cycle.id)
        );
      }));

      queries.push(...cyclesActivitiesForUpdate.map(cycleActivity => {
        const data = {
          order: cycleActivity.order
        } as CycleActivityEntity;
        return updateCycleActivity(scope)(data)(builder =>
          builder.andWhere('id', cycleActivity.id)
        );
      }));

      queries.push(...levelThemesForUpdate.map(levelTheme => {
        const data = {
          order: levelTheme.order
        } as LevelThemeEntity;
        return updateLevelTheme(scope)(data)(builder =>
          builder.andWhere('id', levelTheme.id)
        );
      }));
      // ------------------------------------------------

      // resolve as atualizacoes e exclusoes;
      await Promise.all(queries);

      // inserções --------------------------------------
      for (const levelTheme of levelIn.level_themes) {
        for (const cycle of levelTheme.cycles || []) {
          for (const cycleActivity of cycle.cycle_activities || []) {
            if (cycleActivity.isSave && cycleActivity.activity) {
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
            if (cycle.isSave) {
              cycle.id = await insertCycle(scope)({
                name: cycle.name,
                order: cycle.order,
                levelThemeId: cycle.levelThemeId,
                active: cycle.active
              } as CycleEntity);

              cycleActivity.cycleId = cycle.id;
            }
            if (cycleActivity.isSave) {
              await insertCycleActivity(scope)({
                cycleId: cycleActivity.cycleId,
                activityId: cycleActivity.activityId,
                order: cycleActivity.order
              } as CycleActivityEntity);
            }
          }
        }
      }
      console.log('Fim do restore');
      // throw new Error('forçado');
    });
  } catch (e) {
    console.log(e)
    selfScope?.rollback();
  }

  return {
    levelThemesForDelete,
    cyclesForSave,
    cyclesForUpdate,
    cyclesForDelete,
    cyclesActivitiesForSave,
    cyclesActivitiesForUpdate,
    cyclesActivitiesForDelete,
    activitiesForSave,
    activitiesForUpdate,
    embeddedsForUpdate,
  }
}

export const executeTransactions = async (db: DatabaseService, levelIn: ILevel, levelInNow: ILevel, levelOut: ILevel): Promise<any> => {
  const levelThemesForDelete: number[] = [];
  const levelThemesForUpdate: LevelThemeEntity[] = [];

  const cyclesForSave: CycleEntity[] = [];
  const cyclesForUpdate: CycleEntity[] = [];
  const cyclesForDelete: number[] = [];

  const cyclesActivitiesForSave: CycleActivityEntity[] = [];
  const cyclesActivitiesForUpdate: CycleActivityEntity[] = [];
  const cyclesActivitiesForDelete: CycleActivityEntity[] = [];

  const activitiesForSave: IActivity[] = [];
  const activitiesForUpdate: ActivityEntity[] = [];

  const embeddedsForUpdate: EmbeddedActivityDataEntity[] = [];

  // extrai os dados que serão ecluidos
  levelOut.level_themes?.forEach(lt => {
    if (lt.isDelete) {
      levelThemesForDelete.push(lt.id);
    }
    lt.cycles?.forEach(c => {
      if (c.isDelete) {
        cyclesForDelete.push(c.id);
      }
      c.cycle_activities?.forEach(ca => {
        if (ca.isDelete) {
          cyclesActivitiesForDelete.push({
            id: ca.id,
            cycleId: ca.cycleId,
            activityId: ca.activityId,
          } as CycleActivityEntity);
        }
      });
    });
  });

  // extrais os dados que serão criados ou alterados
  levelIn.level_themes.forEach(lt => {
    if (lt.isUpdate) {
      levelThemesForUpdate.push({
        id: lt.id,
        order: lt.order,
      } as LevelThemeEntity);
    }

    // definir exclusao levelTheme

    lt.cycles?.forEach(c => {
      if (c.isSave) {
        cyclesForSave.push({
          levelThemeId: c.levelThemeId,
          name: c.name,
          order: c.order,
          active: true
        } as CycleEntity);
      }
      if (c.isUpdate) {
        cyclesForUpdate.push({
          id: c.id,
          levelThemeId: c.levelThemeId,
          name: c.name,
          order: c.order,
          active: true
        });
      }

      c.cycle_activities?.forEach(ca => {
        if (ca.isSave) {
          cyclesActivitiesForSave.push({
            cycleId: ca.cycleId,
            activityId: ca.activityId,
            order: ca.order,
          } as CycleActivityEntity);
        }
        if (ca.isUpdate) {
          cyclesActivitiesForUpdate.push({
            id: ca.id,
            cycleId: ca.cycleId,
            activityId: ca.activityId,
            order: ca.order,
          } as CycleActivityEntity);
        }

        if (ca.activity && ca.activity?.isSave) {
          activitiesForSave.push(ca.activity);
        }

        if (ca.activity && ca.activity?.isUpdate) {
          activitiesForUpdate.push({
            id: ca.activity.id,
            name: ca.activity.name,
            description: ca.activity.description,
            estimatedTime: ca.activity.estimatedTime,
            typeId: 1,
            active: true
          } as ActivityEntity);

          embeddedsForUpdate.push({
            activityId: ca.activity.id,
            height: ca.activity.embedded_activity_data.height,
            url: ca.activity.embedded_activity_data.url
          });
        }
        
      });
    });
  });

  let selfScope: Knex.Transaction<any, any> = {} as any;
  try {
    await db.transaction(async scope => {
      selfScope = scope;

      // exclusoes-----------------------------------
      // para as exclusoes foi adodato o envio sequencial pois é a transãcao mais custosa e propensa a erros.

      // fesse reducer retorna um array com os ids do cycloActivity que contem, e outro com os que não contem.
      const { ids, ca } = cyclesActivitiesForDelete.reduce(
        (acc, item) => {
          item.id ? acc.ids.push(item.id) : acc.ca.push({ cycleId: item.cycleId, activityId: item.activityId });
          return acc;
        },
        { ids: [], ca: [] } as {
          ids: number[];
          ca: { cycleId: number; activityId: number }[];
        }
      );

      ids.length && await deleteCycleActivity(scope)(builder => 
        builder.whereIn('id', ids)
      );

      for (const c of ca) {
        await deleteCycleActivity(scope)(builder => 
          builder
            .andWhere('cycleId', c.cycleId)
            .andWhere('activityId', c.activityId)
        );
      }

      cyclesForDelete.length && await deleteCycle(scope)(builder => 
        builder.whereIn('id', cyclesForDelete)
      );

      levelThemesForDelete.length && await deleteLevelTheme(scope)(builder => 
        builder.whereIn('id', levelThemesForDelete)
      );

      console.log('\n\nExclusões realizadas \n');
      // ---------------------------------------------

      // atualizacoes --------------------------------
      // nas atualizaçoes envio todas as promesas de uma unica vez pois são as maisrapdas.
      const queries: Promise<any>[] = [];
      queries.push(...activitiesForUpdate.map(activity => { 
        const data = {
          name: activity.name,
          description: activity.description,
          estimatedTime: activity.estimatedTime,
          active: activity.active
        } as ActivityEntity;
        return updateActivity(scope)(data)(builder => 
          builder.andWhere('id', activity.id)
        );
      }));

      queries.push(...embeddedsForUpdate.map(embedded => {
        const data = {
          height: embedded.height,
          url: embedded.url
        } as EmbeddedActivityDataEntity;
        return updateEmbeddedActivityData(scope)(data)(builder => 
          builder.andWhere('activityId', embedded.activityId)
        );
      }));

      queries.push(...cyclesForUpdate.map(cycle => {
        const data = {
          name: cycle.name,
          order: cycle.order,
          active: cycle.active
        } as CycleEntity;
        return updateCycle(scope)(data)(builder => 
          builder.andWhere('id', cycle.id)
        );
      }));

      queries.push(...cyclesActivitiesForUpdate.map(cycleActivity => {
        const data = {
          order: cycleActivity.order
        } as CycleActivityEntity;
        return updateCycleActivity(scope)(data)(builder =>
          builder.andWhere('id', cycleActivity.id)
        );
      }));

      queries.push(...levelThemesForUpdate.map(levelTheme => {
        const data = {
          order: levelTheme.order
        } as LevelThemeEntity;
        return updateLevelTheme(scope)(data)(builder =>
          builder.andWhere('id', levelTheme.id)
        );
      }));
       await Promise.all(queries);
       console.log('\n\nAtualizações realizadas \n');
      // ------------------------------------------------

      /// inserções --------------------------------------
      // nas insercoes tambem foi adotado o metodo sequencial pois preciso recuperar os ids inseridos
      // para ser utilizados nas chaves esntrangeiras
      for (const levelTheme of levelIn.level_themes) {
        for (const cycle of levelTheme.cycles || []) {
          for (const cycleActivity of cycle.cycle_activities || []) {
            if (cycleActivity.isSave && cycleActivity.activity) {
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
            if (cycle.isSave) {
              cycle.id = await insertCycle(scope)({
                name: cycle.name,
                order: cycle.order,
                levelThemeId: cycle.levelThemeId,
                active: cycle.active
              } as CycleEntity);

              cycleActivity.cycleId = cycle.id;
            }
            if (cycleActivity.isSave) {
              await insertCycleActivity(scope)({
                cycleId: cycleActivity.cycleId,
                activityId: cycleActivity.activityId,
                order: cycleActivity.order
              } as CycleActivityEntity);
            }
          }
        }
      }
      console.log('\n\nFim do restore\n');
      throw new Error('forçado');
    });
  } catch (e) {
    console.log(e)
    selfScope?.rollback();
  }

  return {
    levelThemesForDelete,
    cyclesForSave,
    cyclesForUpdate,
    cyclesForDelete,
    cyclesActivitiesForSave,
    cyclesActivitiesForUpdate,
    cyclesActivitiesForDelete,
    activitiesForSave,
    activitiesForUpdate,
    embeddedsForUpdate,
  }
}