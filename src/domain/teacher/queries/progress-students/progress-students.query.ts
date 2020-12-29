import { GQLProgressStudentResolvers, GQLQueryResolvers } from "../../../../resolvers-types";

export interface ProgressStudents {
    name: string;
    totalActivities: number;
    totalActivitiesCompleted: number;
}

export const progressStudentsQueryResolver: GQLQueryResolvers['progressStudents'] = async (obj, { data }, context) => {

    const query = context.database.raw<ProgressStudents>(`
        select u2.name, a.totalActivities, IFNULL(b.totalActivitiesCompleted, 0) as totalActivitiesCompleted
        from enrollment e 
        inner join user u2 on e.userId = u2.id 
        inner join level_code lc on e.levelCodeId = lc.id
        inner join class c on c.levelCodeId = lc.id
        inner join enrollment_class on enrollment_class.enrollmentId = e.id
        inner join (
            SELECT COUNT(1) as totalActivities, class.id
            FROM class
            INNER JOIN level_code on level_code.id = class.levelCodeId
            INNER JOIN level on level.id = level_code.levelId
            INNER JOIN level_theme on level_theme.levelId = level.id
            INNER JOIN cycle on cycle.levelThemeId = level_theme.id
            INNER JOIN cycle_activity on cycle_activity.cycleId = cycle.id
            WHERE class.id = '${data.classId}'
        ) as a on c.id=a.id
        left join (
            SELECT count(*) AS totalActivitiesCompleted, activity_timer.classId, activity_timer.userId
            FROM activity_timer
            WHERE activity_timer.completed = true
            AND activity_timer.classId = '${data.classId}'
            AND activity_timer.userId = '${data.studentId}'
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
        ) as b on b.classId=enrollment_class.classId and b.userId=u2.id
        where e.userId = '${data.studentId}' and c.id='${data.classId}'
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

