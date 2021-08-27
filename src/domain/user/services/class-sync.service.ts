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
import { insertMeeting, selectMeeting, updateMeeting } from "../../../shared/repositories/meeting.repository";
import { upsertCountEntity } from "../../../shared/repositories/count.repository";
import { Redis } from "ioredis";


export const processClassSync =
    (db: DatabaseService, readonlyDatabase: DatabaseService, log: FastifyLoggerInstance, redis?: Redis) => async (event: ClassSyncEvent): Promise<WebhookResponse> => {
        // return await db.transaction(async trx => {
        const data = event.data;
        const classData = data.class;
        const existingClass = await getClassById(readonlyDatabase)(data.class.id);
        const hasLevelCode = await getLevelCodeById(readonlyDatabase)(classData.level.id)
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
            const hasRegional = getOneOrNull((await readonlyDatabase.select<RegionalEntity[]>([`${REGIONAL_TABLE}.*`]).from(REGIONAL_TABLE).where(`${REGIONAL_TABLE}.name`, classData.regional)));
            const hasCampus = getOneOrNull((await readonlyDatabase.select<CampusEntity[]>([`${CAMPUS_TABLE}.*`]).from(CAMPUS_TABLE).where(`${CAMPUS_TABLE}.name`, classData.campus)));
            const hasLocal = getOneOrNull((await readonlyDatabase.select<LocalEntity[]>([`${LOCAL_TABLE}.*`]).from(LOCAL_TABLE).where(`${LOCAL_TABLE}.name`, classData.local)));
            const {
                campusId, localId, regionalId
            } = await updateRegionCampusLocal(db, classData, hasRegional, hasCampus, hasLocal);
            const times = {
                startDate: format((new Date(classData.startDate).setUTCHours(new Date(classData.startDate).getUTCHours() + 6)), "yyyy-MM-dd"),
                endDate: format((new Date(classData.endDate).setUTCHours(new Date(classData.endDate).getUTCHours() + 6)), "yyyy-MM-dd"),
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
                hasActivated: classData.status.toUpperCase() === "C" ? false : true,
                regionalId: regionalId,
                hasEcampus: classData.hasECampusAccess,
                hasEyoung: classData.mnft,
                ...times,
            })
            await processTeacherData(db, classData)
            await processMeetingData(db, readonlyDatabase, classData, redis)
            return {
                success: true,
            }
        } else {
            const hasRegional = getOneOrNull((await readonlyDatabase.select<RegionalEntity[]>([`${REGIONAL_TABLE}.*`]).from(REGIONAL_TABLE).where(`${REGIONAL_TABLE}.name`, classData.regional)));
            const hasCampus = getOneOrNull((await readonlyDatabase.select<CampusEntity[]>([`${CAMPUS_TABLE}.*`]).from(CAMPUS_TABLE).where(`${CAMPUS_TABLE}.name`, classData.campus)));
            const hasLocal = getOneOrNull((await readonlyDatabase.select<LocalEntity[]>([`${LOCAL_TABLE}.*`]).from(LOCAL_TABLE).where(`${LOCAL_TABLE}.name`, classData.local)));
            const fullClassDataDivergent = isFullClassDataDivergent(existingClass, classData)
            if (fullClassDataDivergent || (!hasRegional || !hasCampus || !hasLocal)) {
                const {
                    campusId, localId, regionalId
                } = await updateRegionCampusLocal(db, classData, hasRegional, hasCampus, hasLocal);
                const times = {
                    startDate: format((new Date(classData.startDate).setUTCHours(new Date(classData.startDate).getUTCHours() + 6)), "yyyy-MM-dd"),
                    endDate: format((new Date(classData.endDate).setUTCHours(new Date(classData.endDate).getUTCHours() + 6)), "yyyy-MM-dd"),
                }
                await updateClass(db)({
                    name: classData.name,
                    institutionId: classData.institutionId,
                    carrerId: classData.carrerId,
                    periodId: classData.periodId,
                    sessionId: classData.sessionId,
                    levelCodeId: levelCodeId,
                    campusId: campusId,
                    localId: localId,
                    regionalId: regionalId,
                    hasActivated: classData.status.toUpperCase() === "C" ? false : true,
                    hasEcampus: classData.hasECampusAccess,
                    hasEyoung: classData.mnft,
                    ...times,
                })(where => where.andWhere('id', classData.id));
            }
            await processTeacherData(db, classData)
            await processMeetingData(db, readonlyDatabase, classData, redis)
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

            await updateUser(db)({
                name: teacher.name,
                macId: teacher.macID,
                macPass: teacher.macPass,
            })(builder => builder.andWhere('id', teacher.id));
            // insert teacher role if it is different
            const hasTeacherRole = Boolean(userRoles.find(userRole => userRole.roleId === RoleId.TEACHER));
            if (!hasTeacherRole) {
                await insertUserRole(db)(professorUserRole);
            }
            const hasTeacherClasss = Boolean(await selectTeacherClass(db).where("classId", "=", teacherClassData.classId).andWhere("teacherId", "=", teacherEntity.id).first())
            if (!hasTeacherClasss) {
                await insertTeacherClass(db)(teacherClassData);
            }
        }
        await deleteTeacherClass(db)(qb => qb.whereNot("teacherId", teacher.id).andWhere("classId", classData.id))
    }
    //  when we need more than 1 teacher, delete all others execept what we received
    // await deleteTeacherClass(db)(qb => qb.whereNotIn("teacherId", teachers.map((item) => item.id)).andWhere("classId", classData.id))
}

async function processMeetingData(db: DatabaseService, readonlyDatabase: DatabaseService, classData: t.TypeOf<typeof ClassWithLocationsFullDataType>, redis?: Redis) {
    const meetings = classData.meetings
    const classId = classData.id;
    const savedMeetings = await selectMeeting(readonlyDatabase).where("classId", "=", classId)
    if (meetings && meetings.length > 0) {
        for (const meet of meetings) {
            const hasMeet = savedMeetings.find(item => item.attendTmpltNbr == meet.attendTmpltNbr);
            if (hasMeet) {
                await updateMeeting(db)({
                    classId,
                    attendTmpltNbr: meet.attendTmpltNbr,
                    date: meet.date,
                    enabled: true,
                    endHour: meet.endHour,
                    startHour: meet.startHour,
                    facilityId: meet.facilityId,
                    objetive: meet.objetive,
                    teacherNotes: meet.teachernotes,
                    homework: meet.homework

                })(qb => qb.where("id", "=", hasMeet.id))
                await upsertCountEntity("meet", db)
            } else {
                await insertMeeting(db)({
                    classId,
                    attendTmpltNbr: meet.attendTmpltNbr,
                    date: meet.date,
                    enabled: true,
                    endHour: meet.endHour,
                    startHour: meet.startHour,
                    facilityId: meet.facilityId,
                    objetive: meet.objetive,
                    teacherNotes: meet.teachernotes,
                    homework: meet.homework
                })
                await upsertCountEntity("meet", db)
            }
        }
        const ids = meetings.map(item => item.attendTmpltNbr)
        await updateMeeting(db)({
            enabled: false,
        })(qb => qb.whereNotIn("attendTmpltNbr", ids)
            .andWhere("classId", "=", classId)
        )
    } else {
        await updateMeeting(db)({
            enabled: false,
        })(qb => qb.where("classId", "=", classId))
    }
    if (redis && classData.status.toUpperCase() === "C") {
        await redis.del("meetingClass-" + classId)
    }

    if (redis && classData.status.toUpperCase() !== "C") {
        const [result] = await readonlyDatabase.raw(`
        select
        m.*,
        m.id as id,
        lc.code as courseName,
        teacher.name as teacherName,
        teacher.id as ProfessorId
    from
        meeting m
    inner join class c 
            on
        c.id = m.classId
    inner join level_code lc
            on
        lc.id = c.levelCodeId
    LEFT JOIN
            (
        SELECT
            teacher_class.classId,
            user.name,
            user.id
        FROM
            teacher_class,
            user
        WHERE
            teacher_class.teacherId = user.id
        GROUP BY
            teacher_class.classId,
            user.name,
            user.id
            ORDER BY user.name
            ) AS teacher
            ON
        teacher.classId = m.classId
    where
        c.id = '${classId}'
        and c.hasActivated = true
        and m.enabled = true
        order by m.date ASC
        `)
        if (result) {
            await redis.set("meetingClass-" + classId, JSON.stringify(result))
        }
    }
}