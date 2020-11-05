import { GQLClassResolvers, GQLClassstudentGradesArgs } from "../../../../resolvers-types";
import { DatabaseLoaderFactory } from "../../../../shared/types/database-loader.type";
import { createDataloaderMultiSort } from "../../../../shared/utils/dataloader-multi-sort";
import { ClassStudentGrade } from "../../types/class-student-grade.type";

const classStudentGradesByClassIdSorter = createDataloaderMultiSort<ClassStudentGrade, string>('classId');

const classStudentGradesByClassIdLoader: DatabaseLoaderFactory<string, ClassStudentGrade[], ClassStudentGrade[], GQLClassstudentGradesArgs> = {
    id: 'classStudentGradesByClassIdLoader',
    batchFn: (db, params) => async (ids) => {
        const studentIds = params.data?.studentIds || [];
        const studentIdsParameters = studentIds.length > 0
            ? studentIds.map(() => '?').join(',')
            : null;
        const idsParameters = ids.map(() => '?').join(',');
        const result = await db.raw<[ClassStudentGrade[]]>(`
SELECT
	user.id AS studentId,
    totalActivitiesByClass.classId,
	totalActivitiesByClass.totalActivities,
	totalProgressChecksByClass.totalProgressChecks,
	completedActivitiesByUserAndClass.completedActivities,
	completedProgressChecksByUserAndClass.completedProgressChecks,
    (completedActivitiesByUserAndClass.completedActivities / totalActivitiesByClass.totalActivities) * 100 AS completionGrade,
    (completedProgressChecksByUserAndClass.completedProgressChecks / totalProgressChecksByClass.totalProgressChecks) * 100 AS progressCheckGrade
FROM user
INNER JOIN enrollment on enrollment.userId = user.id
INNER JOIN enrollment_class on enrollment_class.enrollmentId = enrollment.id
INNER JOIN
(
	SELECT COUNT(*) AS totalActivities, class.id AS classId
    FROM class
    INNER JOIN level_code on level_code.id = class.levelCodeId
	INNER JOIN level on level.id = level_code.levelId
    INNER JOIN level_theme on level_theme.levelId = level.id
    INNER JOIN cycle on cycle.levelThemeId = level_theme.id
    INNER JOIN cycle_activity on cycle_activity.cycleId = cycle.id
    WHERE class.id IN (${idsParameters})
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
    WHERE class.id IN (${idsParameters})
    GROUP BY classId
) AS totalProgressChecksByClass
ON totalProgressChecksByClass.classId = enrollment_class.classId
LEFT JOIN (
	SELECT count(*) AS completedActivities
     , activity_timer.userId
     , activity_timer.classId AS classId
    FROM activity_timer
    WHERE activity_timer.completed = true
    AND activity_timer.classId IN (${idsParameters})
    ${studentIdsParameters
                ? 'AND activity_timer.userId IN (' + studentIdsParameters + ')'
                : ''
            }
    AND EXISTS (
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
	completedActivitiesByUserAndClass.classId = totalActivitiesByClass.classId 
    AND completedActivitiesByUserAndClass.userId = user.id

LEFT JOIN (
	SELECT count(*) AS completedProgressChecks
     , activity_timer.userId
     , activity_timer.classId AS classId
    FROM activity_timer
    INNER JOIN cycle_activity ON cycle_activity.id = activity_timer.cycleActivityId
    INNER JOIN activity ON activity.id = cycle_activity.activityId AND activity.name LIKE '%Progress Check%'
    WHERE activity_timer.completed = true
    AND activity_timer.classId IN (${idsParameters})
    ${studentIdsParameters
                ? 'AND activity_timer.userId IN (' + studentIdsParameters + ')'
                : ''
            }
    AND EXISTS (
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
	completedProgressChecksByUserAndClass.classId = totalActivitiesByClass.classId 
	AND completedProgressChecksByUserAndClass.userId = user.id

WHERE enrollment_class.classId IN (${idsParameters})
${studentIdsParameters
                ? 'AND user.id IN (' + studentIdsParameters + ')'
                : ''
            }
;`, [...ids, ...ids, ...ids, ...studentIds, ...ids, ...studentIds, ...ids, ...studentIds]);
        const entities = result[0];

        return classStudentGradesByClassIdSorter(ids)(entities);
    }
}

export const classStudentGradesFieldResolver: GQLClassResolvers['studentGrades'] = async (obj, params, context) => {
    return context.getDatabaseLoader(classStudentGradesByClassIdLoader, {
        data: params.data || null
    }).load(obj.id);


}
