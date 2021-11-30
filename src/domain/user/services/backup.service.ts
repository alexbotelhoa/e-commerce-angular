import { DatabaseService } from "../../../shared/services/database.service";
import { getLevelById } from "../../../shared/repositories/level.repository";
import { selectLevelTheme } from "../../../shared/repositories/level-theme.repository";
import { selectCycle } from "../../../shared/repositories/cycle.repository";
import { selectCycleActivity } from "../../../shared/repositories/cycle-activity.repository";
import { selectActivity } from "../../../shared/repositories/activity.repository";
import { selectEmbeddedActivityData } from "../../../shared/repositories/embedded-activity-data.repository";
import { LevelEntity } from "../../../entities/level.entity";
import { LevelThemeEntity } from "../../../entities/level-theme.entity";
import { CycleEntity } from "../../../entities/cycle.entity";
import { CycleActivityEntity } from "../../../entities/cycle-activity.entity";
import { ActivityEntity } from "../../../entities/activity.entity";
import { EmbeddedActivityDataEntity } from "../../../entities/activities/embedded-activity-data.entity";
import { insertBackup } from "../../../shared/repositories/backup.repository";
import { parse } from "json2csv";

export interface Backup {
        levelId: number | undefined;
        themeId: number;
        themeOrder: number;
        cycleId: number;
        cycleOrder: number;
        cycleName: string;
        activityId: number;
        activityOrder: number;
        activityName: string;
        activityDescription: string | null;
        activityEstimatedTime: string;
        activityEmbeddedUrl: string;
        activityEmbeddedHeight: number;
    }
    export interface BackupInterfaces {
        level: LevelEntity | null;
        levelThemes: LevelThemeEntity[];
        cycles: CycleEntity[];
        cycleActivity: CycleActivityEntity[];
        activityList: ActivityEntity[];
        activityDataEmbedded: EmbeddedActivityDataEntity[];
    }

    export type BackupResponse = {csvModel: Backup[], entities: BackupInterfaces};

export const generateBackup =
    async (readonlyDatabase: DatabaseService, levelId: string): Promise<BackupResponse> => {
        const levelToBackup = await getLevelById(readonlyDatabase)(levelId);
        const levelThemes = await selectLevelTheme(readonlyDatabase).where("levelId", levelId);
        const levelThemesIds = levelThemes.map(lt => lt.id)
        const cycles = await selectCycle(readonlyDatabase).whereIn("levelThemeId", levelThemesIds)
        const cyclesId = cycles.map(i => i.id)
        const cycleActivity = await selectCycleActivity(readonlyDatabase).whereIn("cycleId", cyclesId)
        const activityIds = cycleActivity.map(i => i.activityId)
        const activityList = await selectActivity(readonlyDatabase).whereIn("id", activityIds)
        const activityDataEmbedded = await selectEmbeddedActivityData(readonlyDatabase).whereIn("activityId", activityIds)
        const activityHash = transformArrayToHashTable(activityList, "id")
        const activityDataEmbeddedHash = transformArrayToHashTable(activityDataEmbedded, "activityId")
        const cyclesHash = transformArrayToHashTable(cycles, "id")
        const cycleActivityHash = transformArrayToHashTable(cycleActivity, "activityId")
        const levelThemesHash = transformArrayToHashTable(levelThemes, "id")
        const backup = activityIds.map(activity => {
            const cycleId = cycleActivityHash[activity].cycleId;
            const levelThemeId = cyclesHash[cycleId].levelThemeId
            const levelThemeHash = levelThemesHash[levelThemeId]
            return {
                levelId: levelToBackup?.id,
                themeId : levelThemeHash.themeId,
                themeOrder: levelThemeHash.order,
                cycleId: cycleActivityHash[activity].cycleId,
                cycleOrder: cycleActivityHash[activity].order,
                cycleName: cyclesHash[cycleActivityHash[activity].cycleId].name,
                activityId: activityHash[activity].id,
                activityOrder: cycleActivityHash[activity].order,
                activityName: activityHash[activity].name,
                activityDescription: activityHash[activity].description,
                activityEstimatedTime: activityHash[activity].estimatedTime,
                activityEmbeddedUrl: activityDataEmbeddedHash[activity].url,
                activityEmbeddedHeight: activityDataEmbeddedHash[activity].height,
            }
        })
        return {csvModel: backup, entities: {level: levelToBackup, levelThemes, cycles, cycleActivity, activityList, activityDataEmbedded}}
        // await insert
        //
    }

    interface GenericHash<T = any> {
        [key: string]: T
    }

    export async function saveBackup(backup: BackupResponse, db: DatabaseService, nameBackup: string) {

        await insertBackup(db)({
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            name: nameBackup,
            data: JSON.stringify(backup) as any,
            type: "level"
        })
    }

    export async function generateCsv(backup: BackupResponse) {
        return parse(backup.csvModel);
    }

    function transformArrayToHashTable<T>(array: T[], key: keyof T): GenericHash<T> {
        return array.reduce((acc, value, i) => {
            if (!acc[value[key]]) {
                acc[value[key]] = {}
            }
            acc[value[key]] = value;
            return acc;
        }, {} as any)
    }