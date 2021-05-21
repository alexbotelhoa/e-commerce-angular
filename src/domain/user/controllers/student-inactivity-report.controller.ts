import { FastifyReply, FastifyRequest } from "fastify";
import { parse } from "json2csv";
import { DatabaseService } from "../../../shared/services/database.service";
import { Environment } from "../../../shared/types/environment.type";

export const studentInactivtyReportController = (env: Environment, db: DatabaseService, readonlyDb: DatabaseService) => async (req: FastifyRequest, reply: FastifyReply) => {
    const sql = `
select 
	u.id as userId,
	u.name as userName,
	t.name as teacherName,
	c.id as classId,
	c.name as className,
	ua.lastActivityDate,
	DATEDIFF(CURDATE(), ua.lastActivityDate) as inactivityDaysCount,
	case 
		when DATEDIFF(CURDATE(), ua.lastActivityDate) > 7 then 1
		else 0
	end as sevenDayInactiveStatus,		
	c.startDate as classStartDate,
	c.endDate as classEndDate,
	l.id as nivelId,
	l.name as nivelName,
	c.regionalId,
	c.campusId,
	c.localId
	
from user u
inner join enrollment e on e.userId = u.id 
inner join enrollment_class ec on ec.enrollmentId = e.id 
inner join class c on c.id = ec.classId
inner join level_code lc on lc.id = c.levelCodeId
inner join level l on l.id = lc.levelId 
left join teacher_class tc on tc.classId = c.id
left join user t on t.id = tc.teacherId

left join (
	select at.userId, at.classId, max(at.startTime) as lastActivityDate
	from activity_timer at
	group by at.userId, at.classId
) ua on ua.userId = u.id and ua.classId = c.id

where (c.endDate is null or c.endDate >= DATE_ADD(CURDATE(), INTERVAL -1 MONTH) )
    `
    const [result] = await readonlyDb.raw(sql)
    reply.header("Content-Type", 'text/csv')
    reply.send(parse(result))
}