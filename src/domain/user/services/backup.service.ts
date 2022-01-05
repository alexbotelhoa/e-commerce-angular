/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as csv from 'fast-csv';
import { FastifyReply } from "fastify";
import { parse } from "json2csv";
import { Duplex } from 'stream';

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
import { insertLog } from "../../../shared/repositories/log.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { RedisService } from "../../../shared/services/redis-tools.services";


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

interface ILog {
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

const backupToLevel = (backupCSV: IBackupCSV[]): ILevel => {
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
        const hasCycle = hasLevelTheme.cycles?.find(item => {
          if (item.id) {
            return item.id === cycle.id;
          } else {
            return item.name === cycle.name;
          }
        });

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

const getLevel = (db: DatabaseService, levelId: number): Promise<LevelEntity | null> => {
  return getLevelById(db)(levelId);
}

const applyBusinessRules = (backup: IBackupCSV[]): { isError: boolean, backupWithErrors: (IBackupCSV & { error?: string } )[]} => {
  let isError = false;
  const backupWithErrors = backup.slice().map(item => {
    let error = '';
    if (item.levelId === undefined) {
      error += '**Sem levelId;';
    }
    if ((item.themeId === undefined || item.themeOrder === undefined) && item.cycleId) {
      error += '\n**sem themeId;';
    }
    if (item.cycleId === undefined && (item.cycleName === undefined || item.cycleOrder === undefined)) {
      error += '\n**Ciclo sem nome ou ordem;';
    }
    if (item.activityId === undefined && (!item.activityName || item.activityOrder === undefined || !item.activityDescription || !item.activityEstimatedTime || !item.activityEmbeddedUrl || item.activityEmbeddedHeight === undefined)) {
      error += '\n**Atividade com dados incompletos;';
    }

    if (error !== '') {
      isError = true;
      return { error, ...item };
    }

    return item;
  });

  return {
    isError,
    backupWithErrors
  };
}

const getLevels = async (
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

const elementsForDeletion = (levelIn: ILevel, levelOut: ILevel): void => {
  const cyclesIn = getElementInLevel<ICycle>('cycle', levelIn);
  const activitiesIn = getElementInLevel<IActivity>('activity', levelIn);

  levelOut?.level_themes?.map(lt => {
    lt.cycles?.map(c => {
      const isCycleIn = cyclesIn.find(cin => cin.id === c.id);
      // @ts-ignore
      if (!isCycleIn && c.id !== '') {
        c.isDelete = true;
      }

      c.cycle_activities?.map(ca => {
        const isActivityIn = activitiesIn.find(ain => ain.id === ca.activityId);
        // @ts-ignore
        if (!isActivityIn && ca.id !== '') {
          ca.isDelete = true;
        }
      });
    });

    const isRemoveLevelTheme = lt.cycles?.filter(c => c.isDelete).length === lt.cycles?.length;
    // @ts-ignore
    if (isRemoveLevelTheme && lt.id !== '') {
      lt.isDelete = true;
    }
  });
}

const elementsForCreationBecauseNotExist = async (rdb: DatabaseService, levelIn: ILevel, levelId: number): Promise<void> => {
  const isMesmoLevel = levelIn.id === levelId;
  const themesId: number[] = [];
  const cyclesId: number[] = [];
  const activitiesId: number[] = [];

  levelIn.level_themes.forEach(lt => {
    lt.id && themesId.push(lt.themeId);
    lt.cycles?.length && cyclesId.push(...lt.cycles?.filter(c => c.id).map(c => c.id));
    lt.cycles?.forEach(c => {
      c.cycle_activities?.length && activitiesId.push(...c.cycle_activities.filter(ca => ca.activityId).map(ca => ca.activityId));
    });
  });

  const levelThemeIdBD = await selectLevelTheme(rdb).where('levelId', levelIn.id).whereIn('themeId', themesId);
  const cyclesIdBD = await selectCycle(rdb).whereIn('id', cyclesId);
  const activitiesIdBD = await selectActivity(rdb).select('id').whereIn('id', activitiesId);
  const cyclesActivitiesBD = await selectCycleActivity(rdb);

  levelIn.level_themes.map(lt => {
    if (lt.id) {
      const isExist = levelThemeIdBD.find(ltbd => ltbd.themeId === lt.themeId && ltbd.levelId === levelId);
      if (!isExist) {
        lt.isSave = true;
      } else {
        lt.id = isExist.id;
      }
    }

    lt.cycles?.map(c => {
      if (c.id) {
        const isExist = cyclesIdBD.find(cdb => cdb.id === c.id && cdb.levelThemeId === lt.id);
        if (!isExist) {
          c.isSave = true;
        }
      }

      c.cycle_activities?.map(ca => {
        if (ca.id) {
          const isExist = cyclesActivitiesBD.find(cabd => cabd.cycleId === c.id && cabd.activityId === ca.activityId);
          if (!isExist) {
            ca.isSave = true;
          } else {
            const isExist = cyclesIdBD.find(cdb => cdb.id === c.id && cdb.levelThemeId === lt.id);
            if (!isExist || !isMesmoLevel) {
              // @ts-ignore
              c.id = undefined;
              c.isSave = true;
            }
          }
        }

        if(ca.activity?.id) {
          const isExist = activitiesIdBD.map(adb => adb.id).includes(ca.activity.id);
          if (!isExist) {
            ca.activity.isSave = true;
          }
        } 
      });
    });
  })
}

const elementsForCreation = (levelIn: ILevel, levelOut: ILevel): void => {
  const isMesmoLevel = levelIn.id === levelOut.id;
  const cyclesOut = getElementInLevel<ICycle>('cycle', levelOut);
  const cycleActivitiesOut = getElementInLevel<ICycleActivity>('cycleActivity', levelOut);

  levelIn.level_themes?.map(lt => {
    if (!lt.id) {
      lt.isSave = true;
    }

    lt.cycles?.map(c => {
      const co = cyclesOut.find(co => co.id === c.id);
      if (c.id === undefined && (!isMesmoLevel || !co)) {
        c.levelThemeId = lt.id;
        c.isSave = true;
      }

      c.cycle_activities?.map(ca => {
        const cao = cycleActivitiesOut.find(cao => cao.id === ca.id);
        if (ca.id === undefined && (!isMesmoLevel || !cao)) {
          ca.isSave = true;
        }

        if (ca.activity && ca.activity?.id === undefined) {
          ca.activity.isSave = true;
        }
      });
    });
  });
}

const elementsForUpdation = (levelIn: ILevel, levelInNow: ILevel): void => {
  const levelThemesNow = getElementInLevel<ILeveltheme>('levelTheme', levelInNow);
  const cyclesNow = getElementInLevel<ICycle>('cycle', levelInNow);
  const cyclesActivitiesNow = getElementInLevel<ICycleActivity>('cycleActivity', levelInNow);
  const activitiesNow = getElementInLevel<IActivity>('activity', levelInNow);
  const embeddedsNow = getElementInLevel<EmbeddedActivityDataEntity>('embedded', levelInNow);

  for (const lt of levelIn.level_themes) {
    const levelThemeNow = levelThemesNow.find(ltn => ltn.id === lt.id)
    if (levelThemeNow) {
      const comparationA = lt.order;
      const comparationB = levelThemeNow.order;

      if (comparationA !== comparationB) {
        lt.isUpdate = true;
      }
    }

    for (const cycle of lt.cycles || []) {
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
            name: activityNow.name?.trim(),
            description: activityNow.description?.trim(),
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

const logFactory = (levelIn: ILevel, levelOut: ILevel): ILog => {
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

const executeTransactions = async (db: DatabaseService, levelIn: ILevel, levelOut: ILevel): Promise<any> => {
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
          if (cycle.id) {
            await insertCycle(scope)({
              id: cycle.id,
              name: cycle.name,
              order: cycle.order,
              levelThemeId: levelTheme.id,
              active: cycle.active
            } as CycleEntity);
          } else {
            cycle.id = await insertCycle(scope)({
              name: cycle.name,
              order: cycle.order,
              levelThemeId: levelTheme.id,
              active: cycle.active
            } as CycleEntity);
          }
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
            if (cycleActivity.activity.id) {
              await insertActivity(scope)({
                id: cycleActivity.activity.id,
                name: cycleActivity.activity.name,
                description: cycleActivity.activity.description,
                estimatedTime: cycleActivity.activity.estimatedTime,
                typeId: cycleActivity.activity.typeId,
                active: cycleActivity.activity.active
              } as ActivityEntity);
            } else {
              cycleActivity.activity.id = await insertActivity(scope)({
                name: cycleActivity.activity.name,
                description: cycleActivity.activity.description,
                estimatedTime: cycleActivity.activity.estimatedTime,
                typeId: cycleActivity.activity.typeId,
                active: cycleActivity.activity.active
              } as ActivityEntity);
            }

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
}


export const generateBackup = async (readonlyDatabase: DatabaseService, levelId: string): Promise<IBackupCSV[]> => {
  const level = await getLevelById(readonlyDatabase)(levelId);
  const levelThemes = await selectLevelTheme(readonlyDatabase).where('levelId', levelId);
  const levelThemesIds = levelThemes.map(data => data.id);
  const cycles = await selectCycle(readonlyDatabase).whereIn('levelThemeId', levelThemesIds);
  const cyclesIds = cycles.map(data => data.id);
  const cycleActivity = await selectCycleActivity(readonlyDatabase).whereIn('cycleId', cyclesIds);
  const activityIds = cycleActivity.map(data => data.activityId);
  const activityList = await selectActivity(readonlyDatabase).whereIn('id', activityIds);
  const activityDataEmbedded = await selectEmbeddedActivityData(readonlyDatabase).whereIn('activityId', activityIds);

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

  backup
    .sort((a, b) => a.activityOrder - b.activityOrder)
    .sort((a, b) => a.cycleOrder - b.cycleOrder)
    .sort((a, b) => a.themeOrder - b.themeOrder);

  return backup;
}

export const saveBackup = async (backup: IBackupCSV[], db: DatabaseService, nameBackup: string): Promise<void> => {
  await insertBackup(db)({
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: nameBackup,
      data: JSON.stringify(backup) as any,
      type: "level"
  })
}

export const generateCsv = async (backup: IBackupCSV[]): Promise<string> => {
  return parse(backup);
}

export const getBackup = ( db: DatabaseService, id: number): Promise<BackupEntity | null> => {
  return getBackupById(db)(id);
}

export const obtemDadosCSV = (file: Buffer): Promise<IBackupCSV[]> => {
  function normalizeKeys(row: any) {
    const keys = Object.keys(row) || [];
    const copy: any = {};
    for (const key of keys){
      copy[key.trim()] = row[key];
    }
    return copy;
  }

  function getItem(row: any, key: keyof IBackupCSV, isNumber?: boolean) {
    try {
      const value = row[key] && row[key] !== '' ? row[key] : undefined;
      if (value !== undefined) {
        if (isNumber) {
          return +value.trim();
        }
        return value.trim();
      }
    } catch { }
    return undefined;
  }

  function listener(row: any) {
    row = normalizeKeys(row);
    row?.levelId && !isNaN(row?.levelId) && lista.push({
      levelId: getItem(row, 'levelId', true),
      levelThemeId: getItem(row, 'levelThemeId', true),
      themeId: getItem(row, 'themeId', true),
      themeOrder: getItem(row, 'themeOrder',  true),
      cycleId: getItem(row, 'cycleId', true),
      cycleOrder: getItem(row, 'cycleOrder', true),
      cycleName: getItem(row, 'cycleName'),
      cycleActivityId: getItem(row, 'cycleActivityId', true),
      activityId: getItem(row, 'activityId', true),
      activityOrder: getItem(row, 'activityOrder', true),
      activityName: getItem(row, 'activityName'),
      activityDescription: getItem(row, 'activityDescription'),
      activityEstimatedTime: getItem(row, 'activityEstimatedTime'),
      activityEmbeddedUrl: getItem(row, 'activityEmbeddedUrl'),
      activityEmbeddedHeight: getItem(row, 'activityEmbeddedHeight', true)
    } as IBackupCSV);
  }

  function bufferToStream(myBuuffer: Buffer) {
    const stream = new Duplex();
    stream.push(myBuuffer);
    stream.push(null);
    return stream;
  }

  const lista: IBackupCSV[] = [];
  return new Promise<IBackupCSV[]>((resolve, reject) => {
    bufferToStream(file)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => reject(error))
    .on('data', listener)
    .on('end', () => resolve(lista));
  });
}

export const restoreBackup = async (
  db: DatabaseService,
  rdb: DatabaseService,
  redisService: RedisService,
  levelId: number,
  backup: IBackupCSV[],
  reply: FastifyReply,
  isFinish?: number
): Promise<void> => {
  // controle para saber se ja esta em processamento processamento
  const redisKey = `${levelId}-restore-backup`;
  const data = await redisService.get<ILog>(redisKey, true);
  if (data) {
    if (typeof data === 'string') {
      if (data === 'inProcess') {
        return reply.status(202).send({ message: 'existe uma restauração de backup desse nível em processamento' });
      } else {
        return reply.status(500).send({ message: data });
      }
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
  if (!currentLevel) {
    return reply.status(400).send({ message: 'Level not found' });
  }

  // recupero as informacoes para gerar o snapshot atual do level que vai sair.
  const currentLevelCSV = await generateBackup(rdb, currentLevel.id.toString());
  const rawDate = (new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  const nameBackup = `${currentLevel.name}_${levelId}_${rawDate}_automatic`;

  const { isError, backupWithErrors } = applyBusinessRules(backup);
  if (isError) {
    reply.header("Content-Type", "text/csv");
    return reply.status(400).send(parse(backupWithErrors));
  }

  // busca o level que vai entrar e o level que vai sair
  const levels = await getLevels(rdb, backup, +levelId);
  
  // seta no level os elementos a serem excluidos;
  elementsForDeletion(levels.levelIn, levels.levelOut);

  // seta os cyclos e atividadas que tem id mas não existe no banco
  await elementsForCreationBecauseNotExist(rdb, levels.levelIn, levelId);

  // seta no level os alementos a serem criados
  elementsForCreation(levels.levelIn, levels.levelOut);
  
  // seta no level os elementeos a serem atualizados
  elementsForUpdation(levels.levelIn, levels.levelInNow);

  // um obheto de log com os ids de cada alteracao.
  const log = logFactory(levels.levelIn, levels.levelOut);

  if (!isFinish) {
    return reply.send(log);
  } 

  // caso a requisição demore mais que meio minuto o servidor devolve uma mensagem que notificando que será processado em segundo plano
  redisService.flag = true;
  redisService.setInRedisAfterTimeExpires(redisKey, reply);

  // então, executa as transacoes garantindo que todas tenham exito.
  try {
    await executeTransactions(db, levels.levelIn, levels.levelOut);
    // salva o estado do level antes das alterações do restore
    await saveBackup(currentLevelCSV, db, nameBackup);
    // salva a alteracao no log;
    await insertLog(db)({
      status: "modify-level",
      key: `${redisKey}-${(new Date()).toISOString()}`,
      body: JSON.stringify(log),
    });
  } catch (e) {
    return redisService.throwInRedisAfterTimeExpires(redisKey, reply, e);
  }

  // verifica se executou apos o tempo esperado
  if (!redisService.flag) { 
    redisService.set(redisKey, log);
    return;
  } 

  // indica que executou antes do tempo limite
  redisService.flag = false;
  reply.status(200).send(log);
}