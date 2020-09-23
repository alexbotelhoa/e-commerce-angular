import { GQLClassResolvers } from "../../../../resolvers-types";
import { DatabaseLoaderFactory } from "../../../../shared/types/database-loader.type";
import { createDataloaderMultiSort } from "../../../../shared/utils/dataloader-multi-sort";
import { ClassStudentGrade } from "../../types/class-student-grade.type";

const classStudentGradesByClassIdSorter = createDataloaderMultiSort<ClassStudentGrade, number>('classId');

const classStudentGradesByClassIdLoader: DatabaseLoaderFactory<number, ClassStudentGrade[], ClassStudentGrade[], undefined> = {
    id: 'classStudentGradesByClassIdLoader',
    batchFn: (db) => async (ids) => {
        const result = await db.raw<[ClassStudentGrade[]]>(`
SELECT
	user.id as studentId,
    totalActivitiesByClass.classId,
	totalActivitiesByClass.totalActivities, 
	viewedActivitiesByUserAndClass.viewedActivities,
	completedActivitiesByUserAndClass.completedActivities,
    (viewedActivitiesByUserAndClass.viewedActivities / totalActivitiesByClass.totalActivities) * 100 as viewGrade,
    (completedActivitiesByUserAndClass.completedActivities / totalActivitiesByClass.totalActivities) * 100 as completionGrade
FROM user
inner join enrollment on enrollment.userId = user.id
inner join enrollment_class on enrollment_class.enrollmentId = enrollment.id
inner join
(
	SELECT COUNT(*) as totalActivities, class.id as classId, class.name, class.levelCodeId  from class
    inner join level_code on level_code.id = class.levelCodeId
	inner join level on level.id = level_code.levelId
    inner join level_theme on level_theme.levelId = level.id
    inner join cycle on cycle.levelThemeId = level_theme.id
    inner join cycle_activity on cycle_activity.cycleId = cycle.id
    group by classId
) as totalActivitiesByClass
on totalActivitiesByClass.classId = enrollment_class.classId
left join (
	select count(*) as viewedActivities 
     , activity_timer.userId
     , class.id as classId
    from activity_timer
    inner join cycle_activity on cycle_activity.id = activity_timer.cycleActivityId
    inner join cycle on cycle.id = cycle_activity.cycleId
    inner join level_theme on level_theme.id = cycle.levelThemeId
    inner join level on level.id = level_theme.levelId
    inner join level_code on level_code.levelId = level.id
    inner join class on class.levelCodeId = level_code.id
    group by activity_timer.userId, class.id
) as viewedActivitiesByUserAndClass
on 
	viewedActivitiesByUserAndClass.classId = totalActivitiesByClass.classId 
    and viewedActivitiesByUserAndClass.userId = user.id
left join (
	select count(*) as completedActivities
     , activity_timer.userId
     , class.id as classId
    from activity_timer
    inner join cycle_activity on cycle_activity.id = activity_timer.cycleActivityId
    inner join cycle on cycle.id = cycle_activity.cycleId
    inner join level_theme on level_theme.id = cycle.levelThemeId
    inner join level on level.id = level_theme.levelId
    inner join level_code on level_code.levelId = level.id
    inner join class on class.levelCodeId = level_code.id
    where activity_timer.completed = true
    group by activity_timer.userId, class.id
) as completedActivitiesByUserAndClass
on 
	completedActivitiesByUserAndClass.classId = totalActivitiesByClass.classId 
	and completedActivitiesByUserAndClass.userId = user.id
where enrollment_class.classId in (${ids.map(() => '?').join(',')})
;`, ids);
        const entities = result[0];
        console.log(entities);

        return classStudentGradesByClassIdSorter(ids)(entities);
    }
}

export const classStudentGradesFieldResolver: GQLClassResolvers['studentGrades'] = async (obj, params, context) => {
    return context.getDatabaseLoader(classStudentGradesByClassIdLoader, undefined).load(obj.id);


}
