import { GQLQueryResolvers } from "../../../../resolvers-types";

export const overallClassCompletedActivitiesQueryResolver: GQLQueryResolvers['overallClassCompletedActivities'] = async (obj, params, context) => {
    const results = await context.database.raw(
        `
select
totalActivitiesPerClass.classId,  
totalActivitiesPerClass.totalActivities, 
completedActivitiesPerClass.completedActivities, 
totalStudentsPerClass.totalStudents, 
completedActivities / totalStudents / totalActivities as overallCompletion
from (
	SELECT COUNT(*) as totalActivities, class.id as classId
	from class
	inner join level_code on level_code.id = class.levelCodeId
	inner join level on level.id = level_code.levelId
	inner join level_theme on level_theme.levelId = level.id
	inner join cycle on cycle.levelThemeId = level_theme.id
	inner join cycle_activity on cycle_activity.cycleId = cycle.id
    where class.id = :classId
) as totalActivitiesPerClass
left join 
(
	select count(*) as completedActivities
     , activity_timer.classId as classId
     from activity_timer
    where activity_timer.completed = true
    and activity_timer.classId = :classId
)
as completedActivitiesPerClass
on completedActivitiesPerClass.classId = totalActivitiesPerClass.classId
left join 
(
	select count(*) as totalStudents, enrollment_class.classId
     from user
     inner join enrollment on enrollment.userId = user.id
     inner join enrollment_class on enrollment_class.enrollmentId = enrollment.id
     where enrollment_class.classId = :classId
    
)
as totalStudentsPerClass
on totalStudentsPerClass.classId = totalActivitiesPerClass.classId

where totalActivitiesPerClass.classId = :classId


`
        , {
            classId: params.classId
        });
    console.log(results);
    return results[0][0];
}
