import * as t from "io-ts";
import { Redis } from "ioredis";
import { format, } from "date-fns";
import { FastifyLoggerInstance } from "fastify";

import { RoleId } from "../../../resolvers-types";
import { isFullClassDataDivergent } from "./class-utils";
import { UserRoleEntity } from "../../../entities/user-role.entity";
import { getOneOrNull } from "../../../shared/utils/get-one-or-null.util";
import { LocalEntity, LOCAL_TABLE } from "../../../entities/local.entity";
import { insertLocal } from "../../../shared/repositories/local.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { TeacherClassEntity } from "../../../entities/teacher-class.entity";
import { CampusEntity, CAMPUS_TABLE } from "../../../entities/campus.entity";
import { insertCampus } from "../../../shared/repositories/campus.repository";
import { ClassWithLocationsFullDataType } from "../types/class-full-data.type";
import { ClassSyncEvent, WebhookResponse } from "../types/webhook-events.types";
import { insertRegional } from "../../../shared/repositories/regional.repository";
import { upsertCountEntity } from "../../../shared/repositories/count.repository";
import { RegionalEntity, REGIONAL_TABLE } from "../../../entities/regional.entity";
import { insertUserRole, selectUserRole } from "../../../shared/repositories/user-role.repository";
import { getUserById, insertUser, updateUser } from "../../../shared/repositories/user.repository";
import { getClassById, insertClass, updateClass } from "../../../shared/repositories/class.repository";
import { getLevelCodeById, insertLevelCode, } from "../../../shared/repositories/level-code.repository";
import { insertMeeting, selectMeeting, updateMeeting } from "../../../shared/repositories/meeting.repository";
import { deleteTeacherClass, insertTeacherClass, selectTeacherClass } from "../../../shared/repositories/teacher-class.repository";
import { updateEnrollment } from "../../../shared/repositories/enrollment.repository";
import { selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";

export const processClassSync = (
    db: DatabaseService,
    readonlyDatabase: DatabaseService,
    log: FastifyLoggerInstance,
    redis?: Redis
) => async (event: ClassSyncEvent): Promise<WebhookResponse> => {
    const data = event.data;
    const classData = data.class;
    const existingClass = await getClassById(readonlyDatabase)(data.class.id);
    const hasLevelCode = await getLevelCodeById(readonlyDatabase)(classData.level.id);
    let levelCodeId = hasLevelCode ? hasLevelCode.id : null;
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
        const { campusId, localId, regionalId } = await updateRegionCampusLocal(db, classData, hasRegional, hasCampus, hasLocal);
        const times = {
            startDate: format((new Date(classData.startDate).setUTCHours(new Date(classData.startDate).getUTCHours() + 6)), "yyyy-MM-dd"),
            endDate: format((new Date(classData.endDate).setUTCHours(new Date(classData.endDate).getUTCHours() + 6)), "yyyy-MM-dd"),
        };

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
        });
        await processTeacherData(db, classData);
        await processMeetingData(db, readonlyDatabase, classData, redis);

        return {
            success: true,
        }
    } else {
        const hasRegional = getOneOrNull((await readonlyDatabase.select<RegionalEntity[]>([`${REGIONAL_TABLE}.*`]).from(REGIONAL_TABLE).where(`${REGIONAL_TABLE}.name`, classData.regional)));
        const hasCampus = getOneOrNull((await readonlyDatabase.select<CampusEntity[]>([`${CAMPUS_TABLE}.*`]).from(CAMPUS_TABLE).where(`${CAMPUS_TABLE}.name`, classData.campus)));
        const hasLocal = getOneOrNull((await readonlyDatabase.select<LocalEntity[]>([`${LOCAL_TABLE}.*`]).from(LOCAL_TABLE).where(`${LOCAL_TABLE}.name`, classData.local)));
        const fullClassDataDivergent = isFullClassDataDivergent(existingClass, classData);
        const hasEnrollmentClass = await selectEnrollmentClass(readonlyDatabase).where('classId', classData.id);
        console.log("hasEnrollmentClass: ", hasEnrollmentClass)

        if (fullClassDataDivergent || (!hasRegional || !hasCampus || !hasLocal)) {
            const { campusId, localId, regionalId } = await updateRegionCampusLocal(db, classData, hasRegional, hasCampus, hasLocal);
            const times = {
                startDate: format((new Date(classData.startDate).setUTCHours(new Date(classData.startDate).getUTCHours() + 6)), "yyyy-MM-dd"),
                endDate: format((new Date(classData.endDate).setUTCHours(new Date(classData.endDate).getUTCHours() + 6)), "yyyy-MM-dd"),
            };

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
            })(builder => builder.andWhere('id', classData.id));
        }

        hasEnrollmentClass.map(async (enrollment) => {
            await updateEnrollment(db)({
                levelCodeId: classData.level.id
            })(builder => builder.where('id', enrollment.enrollmentId));
        })

        await processTeacherData(db, classData);
        await processMeetingData(db, readonlyDatabase, classData, redis);

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
        })).toString();
    }

    if (!campus) {
        campusId = (await insertCampus(db)({
            description: classData.campusDescription,
            name: classData.campus,
            regionalId: regionalId,
        })).toString();
    }

    if (!local) {
        localId = (await insertLocal(db)({
            description: classData.localDescription,
            name: classData.local,
            campusId: campusId,
        })).toString();
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
        };
        const teacherClassData: Omit<TeacherClassEntity, 'id'> = {
            classId: classData.id,
            teacherId: teacher.id,
        };

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
            await updateUser(db)({
                name: teacher.name,
                macId: teacher.macID,
                macPass: teacher.macPass,
            })(builder => builder.andWhere('id', teacher.id));

            const userRoles = await selectUserRole(db).andWhere('userId', teacher.id);
            const hasTeacherRole = Boolean(userRoles.find(userRole => userRole.roleId === RoleId.TEACHER));
            if (!hasTeacherRole) {
                await insertUserRole(db)(professorUserRole);
            }

            const hasTeacherClasss = Boolean(await selectTeacherClass(db).where("classId", "=", teacherClassData.classId).andWhere("teacherId", "=", teacherEntity.id).first());
            if (!hasTeacherClasss) {
                await insertTeacherClass(db)(teacherClassData);
            }
        }
        await deleteTeacherClass(db)(builder => builder.whereNot("teacherId", teacher.id).andWhere("classId", classData.id));
    }
}

async function processMeetingData(db: DatabaseService, readonlyDatabase: DatabaseService, classData: t.TypeOf<typeof ClassWithLocationsFullDataType>, redis?: Redis) {
    const classId = classData.id;
    const meetings = classData.meetings;
    const savedMeetings = await selectMeeting(readonlyDatabase).where("classId", "=", classId);
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
                    homework: meet.homework,
                })(builder => builder.where("id", "=", hasMeet.id));
                await upsertCountEntity("meet", db);
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
                    homework: meet.homework,
                });
                await upsertCountEntity("meet", db);
            }
        }

        const ids = meetings.map(item => item.attendTmpltNbr);
        await updateMeeting(db)({
            enabled: false,
        })(builder => builder.whereNotIn("attendTmpltNbr", ids).andWhere("classId", "=", classId));
    } else {
        await updateMeeting(db)({
            enabled: false,
        })(builder => builder.where("classId", "=", classId));
    }

    if (redis && classData.status.toUpperCase() === "C") {
        await redis.del("meetingClass-" + classId);
    }

    if (redis && classData.status.toUpperCase() !== "C") {
        const [result] = await readonlyDatabase.raw(`
            SELECT
                m.*,
                m.id as id,
                lc.code as courseName,
                teacher.name as teacherName,
                teacher.id as ProfessorId
            FROM
                meeting m
            INNER JOIN class c ON c.id = m.classId
            INNER JOIN level_code lc ON lc.id = c.levelCodeId
            LEFT JOIN (
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
            ) AS teacher ON teacher.classId = m.classId
            WHERE
                c.id = '${classId}'
                AND c.hasActivated = true
                AND m.enabled = true
            ORDER BY m.date ASC
        `);

        if (result) {
            await redis.set("meetingClass-" + classId, JSON.stringify(result));
        }
    }
}
