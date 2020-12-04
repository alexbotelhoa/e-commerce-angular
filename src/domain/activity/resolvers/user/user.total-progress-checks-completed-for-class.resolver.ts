
import { CountObj } from "../../../../shared/types/count-obj.type";
import { DatabaseLoaderFactory } from "../../../../shared/types/database-loader.type";
import { createDataloaderCountSort } from "../../../../shared/utils/dataloader-count-sort";

type totalProgressChecksByClass = CountObj & {
	classId: string
	userId: string
}

const totalProgressChecksByClassSorter = createDataloaderCountSort<totalProgressChecksByClass, string>('userId');

export const totalProgressChecksByClassIdLoader: DatabaseLoaderFactory<string, number, string, string> = {
	id: 'totalProgressChecksByClassIdLoader',
	batchFn: (db, params) => async (userId) => {
		const ids = userId.map(() => '?').join(',');
		const entities = await db.raw<[totalProgressChecksByClass[]]>(`
				SELECT
					count(*),
					activity_timer.userId
				FROM
					activity_timer
				INNER JOIN cycle_activity ON
					cycle_activity.id = activity_timer.cycleActivityId
				INNER JOIN activity ON
					activity.id = cycle_activity.activityId
					AND activity.name LIKE '%Progress Check%'
				WHERE
					activity_timer.completed = true
					and classId = ?
					and userId in (${ids})
					AND EXISTS (
					SELECT
						cycle_activity.*
					FROM
						class
					INNER JOIN level_code on
						level_code.id = class.levelCodeId
					INNER JOIN level on
						level.id = level_code.levelId
					INNER JOIN level_theme on
						level_theme.levelId = level.id
					INNER JOIN cycle on
						cycle.levelThemeId = level_theme.id
					INNER JOIN cycle_activity on
						cycle_activity.cycleId = cycle.id
					WHERE
						class.id = activity_timer.classId
						AND cycle_activity.id = activity_timer.cycleActivityId )
				GROUP BY
					activity_timer.userId,
					activity_timer.classId
            `, [params, ...userId])
		const result = entities[0]
		return totalProgressChecksByClassSorter(userId)(result)
	}
}