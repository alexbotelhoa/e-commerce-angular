import { GQLResolvers } from "../../resolvers-types"

import { levelsQueryResolver } from "../../domain/activity/queries/levels/levels.query";
import { levelQueryResolver } from "../../domain/activity/queries/level/level.query";
import { availableThemesResolver } from "../../domain/activity/queries/level/level.query"

import { themesQueryResolver } from "../../domain/activity/queries/themes/themes.query";
import { themeQueryResolver } from "../../domain/activity/queries/theme/theme.query";

import { activitiesQueryResolver } from "../../domain/activity/queries/activities/activities.query";
import { activityQueryResolver } from "../../domain/activity/queries/activity/activity.query";

import { cyclesQueryResolver } from "../../domain/activity/queries/cycles/cycles.query"
import { cycleQueryResolver } from "../../domain/activity/queries/cycle/cycle.query"
import { availableActivitiesForCycleResolver } from "../../domain/activity/queries/cycle/available-activities-for-cycle.query"

import { levelThemesQueryResolver } from "../../domain/activity/queries/level-themes/level-themes.query"
import { levelThemeQueryResolver } from "../../domain/activity/queries/level-theme/level-theme.query"

import { cycleActivitiesQueryResolver } from "../../domain/activity/queries/cycle-activities/cycle-activities.query"
import { cycleActivityQueryResolver } from "../../domain/activity/queries/cycle-activity/cycle-activity.query"
import { currentUserQueryResolver } from "../../domain/authentication/queries/current-user.query";
import { levelCodesQueryResolver } from "../../domain/activity/queries/level-codes/level-codes.query";
import { themeIconsQueryResolver } from "../../domain/activity/queries/icons/icons.query";
import { classesQueryResolver } from "../../domain/activity/queries/class/classes.query";
import { myEnrollmentsQueryResolver } from "../../domain/activity/queries/my-enrollments/my-enrollments.query";
import { myLevelQueryResolver } from "../../domain/activity/queries/my-levels/my-levels.query";
import { activityCommentsQueryResolver } from "../../domain/activity/queries/activity-comments/activity-comments.query";
import { teacherClassesQueryResolver } from "../../domain/teacher/queries/teacher-classes/teacher-classes.query";
import { viewerTeacherClassesQueryResolver } from "../../domain/teacher/queries/viewer-teacher-classes/viewer-teacher-classes.query";
import { classStudentsQueryResolver } from "../../domain/teacher/queries/class-students/class-students.query";
import { viewerTeacherLevelCodesQueryResolver } from "../../domain/teacher/queries/viewer-teacher-level-codes/viewer-teacher-level-codes.query";
import { avatarsQueryResolver } from "../../domain/avatar/queries/avatars/avatars.query";
import { challengesQueryResolver } from "../../domain/activity/queries/challenges/challenges.query";
import { activeChallengeQueryResolver } from "../../domain/activity/queries/active-challenge/active-challenge.query";
import { classQueryResolver } from "../../domain/activity/queries/class/class.query";
import { overallClassCompletedActivitiesQueryResolver } from "../../domain/teacher/queries/overall-class-completed-activities/overall-class-completed-activities.query";
import { classLevelThemesQueryResolver } from "../../domain/teacher/queries/class-level-themes/class-level-themes.query";

export const queryResolvers: GQLResolvers['Query'] = {
    theme: themeQueryResolver,
    themes: themesQueryResolver,
    level: levelQueryResolver,
    levels: levelsQueryResolver,
    levelTheme: levelThemeQueryResolver,
    levelThemes: levelThemesQueryResolver,
    activity: activityQueryResolver,
    activities: activitiesQueryResolver,
    cycle: cycleQueryResolver,
    cycles: cyclesQueryResolver,
    cycleActivity: cycleActivityQueryResolver,
    cycleActivities: cycleActivitiesQueryResolver,
    currentUser: currentUserQueryResolver,
    levelCodes: levelCodesQueryResolver,
    availableThemes: availableThemesResolver,
    availableActivitiesForCycle: availableActivitiesForCycleResolver,
    icons: themeIconsQueryResolver,
    classes: classesQueryResolver,
    myEnrollments: myEnrollmentsQueryResolver,
    myLevels: myLevelQueryResolver,
    activityComments: activityCommentsQueryResolver,
    teacherClasses: teacherClassesQueryResolver,
    viewerTeacherClasses: viewerTeacherClassesQueryResolver,
    classStudents: classStudentsQueryResolver,
    viewerTeacherLevelCodes: viewerTeacherLevelCodesQueryResolver,
    avatars: avatarsQueryResolver,
    challenges: challengesQueryResolver,
    activeChallenge: activeChallengeQueryResolver,
    class: classQueryResolver,
    overallClassCompletedActivities: overallClassCompletedActivitiesQueryResolver,
    classLevelThemes: classLevelThemesQueryResolver,
}
