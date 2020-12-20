import { FastifyLoggerInstance } from "fastify";
import * as t from "io-ts";
import { format, } from "date-fns";
import { CampusEntity, CAMPUS_TABLE } from "../../../entities/campus.entity";
import { LocalEntity, LOCAL_TABLE } from "../../../entities/local.entity";
import { RegionalEntity, REGIONAL_TABLE } from "../../../entities/regional.entity";
import { insertCampus } from "../../../shared/repositories/campus.repository";
import { getClassById, insertClass, updateClass } from "../../../shared/repositories/class.repository";
import { getLevelCodeById, insertLevelCode, } from "../../../shared/repositories/level-code.repository";
import { insertLocal } from "../../../shared/repositories/local.repository";
import { insertRegional } from "../../../shared/repositories/regional.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { ClassWithLocationsFullDataType } from "../types/class-full-data.type";
import { ClassSyncEvent, WebhookResponse } from "../types/webhook-events.types";
import { isFullClassDataDivergent } from "./class-utils";
import { getOneOrNull } from "../../../shared/utils/get-one-or-null.util";


export const processClassSync =
    (db: DatabaseService, log: FastifyLoggerInstance) => async (event: ClassSyncEvent): Promise<WebhookResponse> => {
        const data = event.data;
        const classData = data.class;
        const existingClass = await getClassById(db)(data.class.id);
        const hasLevelCode = await getLevelCodeById(db)(classData.level.id)
        let levelCodeId = hasLevelCode ? hasLevelCode.id : null

        if (!levelCodeId) {
            levelCodeId = await insertLevelCode(db)({
                id: classData.level.id,
                active: true,
                code: classData.level.code,
                description: classData.level.code,
                levelId: null,
            });
        }

        if (!existingClass) {
            const hasRegional = getOneOrNull((await db.select<RegionalEntity[]>([`${REGIONAL_TABLE}.*`]).from(REGIONAL_TABLE).where(`${REGIONAL_TABLE}.name`, classData.regional)));
            const hasCampus = getOneOrNull((await db.select<CampusEntity[]>([`${CAMPUS_TABLE}.*`]).from(CAMPUS_TABLE).where(`${CAMPUS_TABLE}.name`, classData.campus)));
            const hasLocal = getOneOrNull((await db.select<LocalEntity[]>([`${LOCAL_TABLE}.*`]).from(LOCAL_TABLE).where(`${LOCAL_TABLE}.name`, classData.local)));
            const {
                campusId, localId, regionalId
            } = await updateRegionCampusLocal(db, classData, hasRegional, hasCampus, hasLocal);
            const times = {
                startDate: format(new Date(classData.startDate), "yyyy-MM-dd"),
                endDate: format(new Date(classData.endDate), "yyyy-MM-dd"),
            }
            await insertClass(db)({
                id: classData.id,
                name: classData.name,
                institutionId: classData.institutionId,
                carrerId: classData.carrerId,
                periodId: classData.periodId,
                sessionId: classData.sessionId,
                levelCodeId: levelCodeId,
                campusId: campusId,
                localId: localId,
                regionalId: regionalId,
                ...times,
            })
            return {
                success: true,
            }
        } else {
            const hasRegional = getOneOrNull((await db.select<RegionalEntity[]>([`${REGIONAL_TABLE}.*`]).from(REGIONAL_TABLE).where(`${REGIONAL_TABLE}.name`, classData.regional)));
            const hasCampus = getOneOrNull((await db.select<CampusEntity[]>([`${CAMPUS_TABLE}.*`]).from(CAMPUS_TABLE).where(`${CAMPUS_TABLE}.name`, classData.campus)));
            const hasLocal = getOneOrNull((await db.select<LocalEntity[]>([`${LOCAL_TABLE}.*`]).from(LOCAL_TABLE).where(`${LOCAL_TABLE}.name`, classData.local)));
            const fullClassDataDivergent = isFullClassDataDivergent(existingClass, classData)
            if (fullClassDataDivergent || (!hasRegional || !hasCampus || !hasLocal)) {
                const {
                    campusId, localId, regionalId
                } = await updateRegionCampusLocal(db, classData, hasRegional, hasCampus, hasLocal);
                const times = {
                    startDate: format(new Date(classData.startDate), "yyyy-MM-dd"),
                    endDate: format(new Date(classData.endDate), "yyyy-MM-dd"),
                }
                await updateClass(db)({
                    name: classData.name,
                    carrerId: classData.carrerId,
                    institutionId: classData.institutionId,
                    periodId: classData.periodId,
                    sessionId: classData.sessionId,
                    levelCodeId: levelCodeId,
                    campusId: campusId,
                    localId: localId,
                    regionalId: regionalId,
                    ...times,
                })(where => where.andWhere('id', classData.id));
            }
            return {
                success: true,
            }
        }
    }

async function updateRegionCampusLocal(db: DatabaseService, classData: t.TypeOf<typeof ClassWithLocationsFullDataType>, regional: RegionalEntity | null, campus: CampusEntity | null, local: LocalEntity | null) {
    let campusId: string | undefined = campus?.id;
    let regionalId: string | undefined = regional?.id;
    let localId: string | undefined = local?.id;

    if (!regional) {
        regionalId = (await insertRegional(db)({
            description: classData.regionalDescription,
            name: classData.regional
        })).toString()
    }

    if (!campus) {
        campusId = (await insertCampus(db)({
            description: classData.campusDescription,
            name: classData.campus,
            regionalId: regionalId,
        })).toString()
    }

    if (!local) {
        localId = (await insertLocal(db)({
            description: classData.localDescription,
            name: classData.local,
            campusId: campusId,
        })).toString()
    }

    return {
        campusId,
        regionalId,
        localId,
    }
}

