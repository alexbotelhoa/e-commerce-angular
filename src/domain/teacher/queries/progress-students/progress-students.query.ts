import { GQLProgressStudentResolvers, GQLQueryResolvers } from "../../../../resolvers-types";

export interface ProgressStudents {
    name: string;
    totalActivities: number;
    totalActivitiesCompleted: number;
}

export const progressStudentsQueryResolver: GQLQueryResolvers['progressStudents'] = async (obj, { data }, context) => {

    const query = context.database.raw<ProgressStudents>(`
        SELECT u2.name, a.totalActivities, IFNULL(b.totalActivitiesCompleted, 0) AS totalActivitiesCompleted
        FROM enrollment e 
        INNER JOIN user u2 ON e.userId = u2.id 
        INNER JOIN level_code lc ON e.levelCodeId = lc.id
        INNER JOIN class c ON c.levelCodeId = lc.id
        INNER JOIN enrollment_class ON enrollment_class.enrollmentId = e.id
        INNER JOIN (
            SELECT COUNT(1) AS totalActivities, class.id
            FROM class
            INNER JOIN level_code ON level_code.id = class.levelCodeId
            INNER JOIN level ON level.id = level_code.levelId
            INNER JOIN level_theme ON level_theme.levelId = level.id
            INNER JOIN cycle ON cycle.levelThemeId = level_theme.id
            INNER JOIN cycle_activity ON cycle_activity.cycleId = cycle.id
            WHERE class.id = '${data.classId}'
        ) AS a ON c.id=a.id
        LEFT JOIN (
            SELECT count(*) AS totalActivitiesCompleted, activity_timer.classId, activity_timer.userId
            FROM activity_timer
            WHERE activity_timer.completed = true
            AND activity_timer.classId = '${data.classId}'
            AND activity_timer.userId = '${data.studentId}'
            AND EXISTS (
                SELECT cycle_activity.*
                FROM class
                INNER JOIN level_code ON level_code.id = class.levelCodeId
                INNER JOIN level ON level.id = level_code.levelId
                INNER JOIN level_theme ON level_theme.levelId = level.id
                INNER JOIN cycle ON cycle.levelThemeId = level_theme.id
                INNER JOIN cycle_activity ON cycle_activity.cycleId = cycle.id
                WHERE class.id = activity_timer.classId
                AND cycle_activity.id = activity_timer.cycleActivityId
            )
            GROUP BY activity_timer.userId, activity_timer.classId
        ) AS b ON b.classId=enrollment_class.classId AND b.userId=u2.id
        WHERE e.userId = '${data.studentId}' AND c.id='${data.classId}'
    `);

    const resultQuery: any = await query;
    const item = resultQuery[0][0];
    if (!item) {
        return {
            name: "",
            totalActivities: 0,
            totalActivitiesCompleted: 0
        };
    }

    return item;
}

export const progressStudentsResolver: GQLProgressStudentResolvers = {
    name: obj => obj.name || "",
    totalActivities: obj => obj.totalActivities || 0,
    totalActivitiesCompleted: obj => obj.totalActivitiesCompleted || 0,
}

