import { FastifyReply, FastifyRequest } from "fastify";
import { parse } from "json2csv";
import { DatabaseService } from "../../../shared/services/database.service";
import { Environment } from "../../../shared/types/environment.type";

export const studentInterestReportController = (env: Environment, db: DatabaseService, readonlyDb: DatabaseService) => async (req: FastifyRequest, reply: FastifyReply) => {
	const active: boolean | undefined = (req.query as any).active || undefined;
	const sql = `
    select
	u.id as userId,
	u.name as student,
	teacher.name as Professor,
	teacher.id as ProfessorId,
	e.levelCodeId,
	regional.name as Regional,
	campus.name as Campus,
	local.name as Local,
	classStudent.class,
	classStudent.startDate as DataInicio,
	classStudent.endDate as DataFim,
	interest.interest
from
	class c
inner join enrollment_class ec on
	ec.classId = c.id
inner join enrollment e on
	e.id = ec.enrollmentId
inner join user u on
	u.id = e.userId
inner join (
select
	a.id,
	a.interest
from
	(
	select
		u.id,
		GROUP_CONCAT(i.name,
		'') as interest
	from
		user u,
		user_interest ui,
		interest i
	where
		u.id = ui.userId
		and ui.interestId = i.id
	group by
		u.id ) as a ) as interest on
interest.id = u.id
inner join (
	select
		class.id as class,
		class.startDate,
		class.endDate,
		u.name as student,
		DATEDIFF(CURDATE(), class.endDate) as dif,
		CURDATE() as curdate,
		u.id
	from
		class
	inner join enrollment_class ec on
		ec.classId = class.id
	inner join enrollment e on
		e.id = ec.enrollmentId
	inner join user u on
		u.id = e.userId
        ${active ? `
        WHERE ((class.endDate is not null or class.startDate is not null))
 	    AND (DATEDIFF(CURDATE(), class.endDate) < 29  AND DATEDIFF(CURDATE(), class.endDate) > -1000  )
        AND class.startDate <= CURDATE()
        ` : ``}
	) classStudent  on
	classStudent.id = u.id
inner join local on
	local.id = c.localId
inner join campus on
	campus.id = local.campusId
inner join regional on
	regional.id = campus.regionalId
left JOIN (
	SELECT teacher_class.classId,
		user.name, user.id
	FROM
		teacher_class,
		user
	WHERE
		teacher_class.teacherId = user.id ) AS teacher ON
	teacher.classId = classStudent.class
    `
	const [result] = await readonlyDb.raw(sql)
	reply.header("Content-Type", 'text/csv')
	reply.send(parse(result))
}