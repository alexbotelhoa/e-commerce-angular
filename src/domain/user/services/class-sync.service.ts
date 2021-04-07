import { FastifyLoggerInstance } from "fastify";
import * as t from "io-ts";
import { format, } from "date-fns";
import { CampusEntity, CAMPUS_TABLE } from "../../../entities/campus.entity";
import { LocalEntity, LOCAL_TABLE } from "../../../entities/local.entity";
import { RegionalEntity, REGIONAL_TABLE } from "../../../entities/regional.entity";
import { insertCampus } from "../../../shared/repositories/campus.repository";
import { getClassById, insertClass, selectClass, updateClass } from "../../../shared/repositories/class.repository";
import { getLevelCodeById, insertLevelCode, } from "../../../shared/repositories/level-code.repository";
import { insertLocal } from "../../../shared/repositories/local.repository";
import { insertRegional } from "../../../shared/repositories/regional.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { ClassWithLocationsFullDataType } from "../types/class-full-data.type";
import { ClassSyncEvent, WebhookResponse } from "../types/webhook-events.types";
import { isFullClassDataDivergent } from "./class-utils";
import { getOneOrNull } from "../../../shared/utils/get-one-or-null.util";
import { TeacherClassEntity } from "../../../entities/teacher-class.entity";
import { getUserById, insertUser, updateUser } from "../../../shared/repositories/user.repository";
import { insertUserRole, selectUserRole } from "../../../shared/repositories/user-role.repository";
import { RoleId } from "../../../resolvers-types";
import { UserRoleEntity } from "../../../entities/user-role.entity";
import { deleteTeacherClass, insertTeacherClass, selectTeacherClass } from "../../../shared/repositories/teacher-class.repository";
import { consolidateEntities, ConsolidateFinder } from "../../../shared/utils/consolidate-entities";
import { insertMeeting, selectMeeting, updateMeeting } from "../../../shared/repositories/meeting.repository";


export const processClassSync =
    (db: DatabaseService, log: FastifyLoggerInstance) => async (event: ClassSyncEvent): Promise<WebhookResponse> => {
        // return await db.transaction(async trx => {
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
                hasEcampus: classData.hasECampusAccess,
                hasEyoung: classData.mnft,
                ...times,
            })
            await processTeacherData(db, classData)
            await processMeetingData(db, classData)
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
                    hasEcampus: classData.hasECampusAccess,
                    hasEyoung: classData.mnft,
                    ...times,
                })(where => where.andWhere('id', classData.id));
            }
            await processTeacherData(db, classData)
            await processMeetingData(db, classData)
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

async function processTeacherData(db: DatabaseService, classData: t.TypeOf<typeof ClassWithLocationsFullDataType>) {
    const teachers = classData.instructor;
    for (const teacher of teachers) {
        const teacherEntity = await getUserById(db)(teacher.id);
        const professorUserRole: Omit<UserRoleEntity, 'id'> = {
            roleId: RoleId.TEACHER,
            userId: teacher.id,
        }
        const teacherClassData: Omit<TeacherClassEntity, 'id'> = {
            classId: classData.id,
            teacherId: teacher.id,
        }
        if (!teacherEntity) {

            await insertUser(db)({
                id: teacher.id,
                name: teacher.name,
                macId: teacher.macID,
                macPass: teacher.macPass,
            });

            await insertUserRole(db)(professorUserRole);
            await insertTeacherClass(db)(teacherClassData);
        } else {
            const userRoles = await selectUserRole(db).andWhere('userId', teacher.id);

            if (teacherEntity.name !== teacher.name) {
                // only update user if name is different
                await updateUser(db)({
                    name: teacher.name,
                    macId: teacher.macID,
                    macPass: teacher.macPass,
                })(builder => builder.andWhere('id', teacher.id));
            }
            // insert teacher role if it is different
            const hasTeacherRole = Boolean(userRoles.find(userRole => userRole.roleId === RoleId.TEACHER));
            if (!hasTeacherRole) {
                await insertUserRole(db)(professorUserRole);
            }
            await consolidateTeacherClasses(db, teacher.id, [teacherClassData]);
        }
    }
}

async function processMeetingData(db: DatabaseService, classData: t.TypeOf<typeof ClassWithLocationsFullDataType>) {
    const meetings = classData.meetings
    const classId = classData.id;
    const savedMeetings = await selectMeeting(db).where("classId", "=", classId)
    if (meetings && meetings.length > 0) {
        for (const meet of meetings) {
            const date = meet.date
            const hasMeet = savedMeetings.find(item => item.date === meet.date
                && meet.endHour === item.endHour && item.startHour === meet.startHour);
            if (hasMeet) {
                await updateMeeting(db)({
                    classId,
                    ...meet,
                    date
                })(qb => qb.where("id", "=", hasMeet.id))
            } else {
                await insertMeeting(db)({
                    classId,
                    ...meet,
                    date,
                })
            }
        }
    }

}

async function consolidateTeacherClasses(
    db: DatabaseService,
    userId: string,
    teacherClasses: Pick<TeacherClassEntity, "classId" | "teacherId">[],
) {
    const existingClasses = await selectTeacherClass(db).andWhere('teacherId', userId);
    const teacherClassesFinder: ConsolidateFinder<Pick<TeacherClassEntity, "classId" | "teacherId">> =
        (teacherClasses, teacherClassToFind) => Boolean(teacherClasses.find(teacherClass => teacherClass.classId === teacherClassToFind.classId));
    const consolidation = consolidateEntities(teacherClassesFinder)(existingClasses, teacherClasses);
    const idsToDelete = consolidation.toDelete.map(enrollment => enrollment.classId);
    const entitiesToInsert = consolidation.toInsert;

    if (idsToDelete.length > 0) {
        await deleteTeacherClass(db)(builder => builder.andWhere('teacherId', userId).whereIn('classId', idsToDelete));
    }
    if (entitiesToInsert.length > 0) {
        await insertTeacherClass(db)(entitiesToInsert);
    }
}

