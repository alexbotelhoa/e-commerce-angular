import { FastifyRequest, FastifyReply } from "fastify";
import { DatabaseService } from "../../../shared/services/database.service";
import { Environment } from "../../../shared/types/environment.type";
import { parse } from 'json2csv';

export const studentReportController = (env: Environment, db: DatabaseService, readonlyDb: DatabaseService) => async (request: FastifyRequest, reply: FastifyReply) => {
    const [result] = await readonlyDb.raw(`
SELECT
	user.id AS id,
	user.name AS Nome,
	teacher.name as Professor,
    teacher.id as ProfessorId,
    enrollment_class.classId as ClasseId,
    class.name as Classe,
	class.startDate as DataInicio,
	class.endDate as DataFim,
	-- DATEDIFF(class.endDate, CURDATE()) as DifDate,
	level.name as Nivel,
	level_code.code as CodigoNivel,
    totalActivitiesByClass.totalActivities as TotalAtividades,
    regional.name as Regional,
	campus.name as Campus,
	local.name as Local,
	regional.description as RegionalDesc,
	campus.description as CampusDesc,
	local.description as LocalDesc,
	IFNULL(totalProgressChecksByClass.totalProgressChecks, 0) as totalProgressChecks,
	IFNULL(completedActivitiesByUserAndClass.completedActivities, 0) as AtividadesFinalizadas,
	IFNULL(completedProgressChecksByUserAndClass.completedProgressChecks, 0) as ProgressChecksFinalizados,
    IFNULL((completedActivitiesByUserAndClass.completedActivities / totalActivitiesByClass.totalActivities) * 100, 0) AS completionGrade,
    IFNULL((completedProgressChecksByUserAndClass.completedProgressChecks / totalProgressChecksByClass.totalProgressChecks) * 100, 0) AS progressCheckGrade
FROM user
INNER JOIN enrollment on enrollment.userId = user.id
INNER JOIN enrollment_class on enrollment_class.enrollmentId = enrollment.id
inner join class on class.id = enrollment_class.classId
    AND ( (class.endDate is not null) or (class.startDate is not null))
 	 AND DATEDIFF(CURDATE(), class.endDate) < 29
    AND class.startDate <= CURDATE()
inner join local on
	 local.id = class.localId
inner join campus on
	campus.id = local.campusId
inner join regional on
	regional.id = campus.regionalId
inner join level_code on level_code.id = class.levelCodeId
inner join level on level.id = level_code.levelId
LEFT JOIN
(
	SELECT COUNT(*) AS totalActivities, class.id AS classId
    FROM class
    INNER JOIN level_code on level_code.id = class.levelCodeId
	INNER JOIN level on level.id = level_code.levelId
    INNER JOIN level_theme on level_theme.levelId = level.id
    INNER JOIN cycle on cycle.levelThemeId = level_theme.id
    INNER JOIN cycle_activity on cycle_activity.cycleId = cycle.id
    -- WHERE class.id IN ($ {idsParameters})
    GROUP BY classId
) AS totalActivitiesByClass
ON totalActivitiesByClass.classId = enrollment_class.classId
LEFT JOIN
(
	SELECT COUNT(*) AS totalProgressChecks, class.id AS classId
    FROM class
    INNER JOIN level_code on level_code.id = class.levelCodeId
	INNER JOIN level on level.id = level_code.levelId
    INNER JOIN level_theme on level_theme.levelId = level.id
    INNER JOIN cycle on cycle.levelThemeId = level_theme.id
    INNER JOIN cycle_activity on cycle_activity.cycleId = cycle.id
    INNER JOIN activity on activity.id = cycle_activity.activityId AND activity.name LIKE '%Progress Check%'
    -- WHERE class.id IN ($ {idsParameters})
    GROUP BY classId
) AS totalProgressChecksByClass
ON totalProgressChecksByClass.classId = enrollment_class.classId
LEFT JOIN (
	SELECT count(*) AS completedActivities
     , activity_timer.userId
     , activity_timer.classId AS classId
    FROM activity_timer
    WHERE activity_timer.completed = true
AND EXISTS(
    SELECT cycle_activity.*
FROM class
    INNER JOIN level_code on level_code.id = class.levelCodeId
        INNER JOIN level on level.id = level_code.levelId
        INNER JOIN level_theme on level_theme.levelId = level.id
        INNER JOIN cycle on cycle.levelThemeId = level_theme.id
        INNER JOIN cycle_activity on cycle_activity.cycleId = cycle.id
        WHERE class.id = activity_timer.classId
        AND cycle_activity.id = activity_timer.cycleActivityId
)
GROUP BY activity_timer.userId, activity_timer.classId
) AS completedActivitiesByUserAndClass
ON
completedActivitiesByUserAndClass.classId = enrollment_class.classId
AND completedActivitiesByUserAndClass.userId = user.id

LEFT JOIN(
    SELECT count(*) AS completedProgressChecks
    , activity_timer.userId
    , activity_timer.classId AS classId
    FROM activity_timer
    INNER JOIN cycle_activity ON cycle_activity.id = activity_timer.cycleActivityId
    INNER JOIN activity ON activity.id = cycle_activity.activityId AND activity.name LIKE '%Progress Check%'
    WHERE activity_timer.completed = true
    AND EXISTS(
        SELECT cycle_activity.*
    FROM class
        INNER JOIN level_code on level_code.id = class.levelCodeId
        INNER JOIN level on level.id = level_code.levelId
        INNER JOIN level_theme on level_theme.levelId = level.id
        INNER JOIN cycle on cycle.levelThemeId = level_theme.id
        INNER JOIN cycle_activity on cycle_activity.cycleId = cycle.id
        WHERE class.id = activity_timer.classId
        AND cycle_activity.id = activity_timer.cycleActivityId
    )
    GROUP BY activity_timer.userId, activity_timer.classId
) AS completedProgressChecksByUserAndClass
ON
completedProgressChecksByUserAndClass.classId = enrollment_class.classId
AND completedProgressChecksByUserAndClass.userId = user.id
LEFT JOIN
    (
        SELECT teacher_class.classId, user.name, user.id
    FROM teacher_class, user
    WHERE teacher_class.teacherId = user.id
    GROUP BY teacher_class.classId, user.name, user.id
    -- ORDER BY teacher_class.classId, user.name
    ) AS teacher
ON teacher.classId = enrollment_class.classId
ORDER BY user.id
    `)
    reply.header("Content-Type", 'text/csv')
    reply.send(parse(result))
}