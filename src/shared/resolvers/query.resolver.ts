import { GQLResolvers } from "../../resolvers-types";
import { classQueryResolver } from "../../domain/class/class.query";
import { countQueryResolver } from "../../domain/count/count.query";
import { userQueryResolver } from "../../domain/user/query/user.query";
import { backupQueryResolver } from '../../domain/backup/backup.query';
import { classesQueryResolver } from "../../domain/class/classes.query";
import { logQueryResolver } from "../../domain/log/queries/log.resolver";
import { getMeetQueryResolver } from "../../domain/meeting/get-meet.query";
import { myLevelQueryResolver } from "../../domain/my-levels/my-levels.query";
import { configQueryResolver } from "../../domain/config/queries/config.query";
import { avatarsQueryResolver } from "../../domain/avatar/queries/avatars.query";
import { getCarrersResolver } from "../../domain/carrer/carrer-permissions.query";
import { levelQueryResolver } from "../../domain/activity/queries/level/level.query";
import { themeQueryResolver } from "../../domain/activity/queries/theme/theme.query";
import { cycleQueryResolver } from "../../domain/activity/queries/cycle/cycle.query";
import { interestQueryResolver } from "../../domain/interest/queries/interest.query";
import { getZoomUrlQueryResolver } from "../../domain/user/query/get-zoom-url.query";
import { themeTotalQueryResolver } from "../../domain/theme/theme.total-parts.query";
import { chatHeaderQueryResolver } from "../../domain/chat/queries/chat-header.query";
import { userRoleQueryResolver } from "../../domain/user-role/queries/user-role.query";
import { challengeQueryResolver } from "../../domain/challenge/queries/challenge.query";
import { levelsQueryResolver } from "../../domain/activity/queries/levels/levels.query";
import { themesQueryResolver } from "../../domain/activity/queries/themes/themes.query";
import { cyclesQueryResolver } from "../../domain/activity/queries/cycles/cycles.query";
import { chatMessageQueryResolver } from "../../domain/chat/queries/chat-message.query";
import { userRolesQueryResolver } from "../../domain/user-role/queries/user-roles.query";
import { challengesQueryResolver } from "../../domain/challenge/queries/challenges.query";
import { themeIconsQueryResolver } from "../../domain/activity/queries/icons/icons.query";
import { availableThemesResolver } from "../../domain/activity/queries/level/level.query";
import { chatStudentsQueryResolver } from "../../domain/chat/queries/chat-students.query";
import { annotationQueryResolver } from "../../domain/annotation/queries/annotation.query";
import { newslettersQueryResolver } from "../../domain/newsletter/queries/newsletters.query";
import { annotationsQueryResolver } from "../../domain/annotation/queries/annotations.query";
import { callOccLoginQueryResolver } from "../../domain/material/material-integration.query";
import { activityQueryResolver } from "../../domain/activity/queries/activity/activity.query";
import { myEnrollmentsQueryResolver } from "../../domain/my-enrollments/my-enrollments.query";
import { getServiceNowUrlQueryResolver } from "../../domain/user/query/get-service-now.query";
import { chatNewMessagesQueryResolver } from "../../domain/chat/queries/chat-new-messages.query";
import { currentUserQueryResolver } from "../../domain/authentication/queries/current-user.query";
import { activitiesQueryResolver } from "../../domain/activity/queries/activities/activities.query";
import { chatNotificationsQueryResolver } from "../../domain/chat/queries/chat-notifications.query";
import { levelThemeQueryResolver } from "../../domain/activity/queries/level-theme/level-theme.query";
import { levelCodesQueryResolver } from "../../domain/activity/queries/level-codes/level-codes.query";
import { activeChallengeQueryResolver } from "../../domain/challenge/queries/activity-challenge.query";
import { classCyclesQueryResolver } from "../../domain/teacher/queries/class-cycles/class-cycles.query";
import { levelThemesQueryResolver } from "../../domain/activity/queries/level-themes/level-themes.query";
import { classStudentsQueryResolver } from "../../domain/teacher/queries/class-students/class-students.query";
import { cycleActivityQueryResolver } from "../../domain/activity/queries/cycle-activity/cycle-activity.query";
import { teacherClassesQueryResolver } from "../../domain/teacher/queries/teacher-classes/teacher-classes.query";
import { cycleActivitiesQueryResolver } from "../../domain/activity/queries/cycle-activities/cycle-activities.query";
import { viewerEnrollmentLevelCodesQueryResolver } from "../../domain/enrollment/viewer-enrollment-level-codes.query";
import { progressStudentsQueryResolver } from "../../domain/teacher/queries/progress-students/progress-students.query";
import { activityCommentsQueryResolver } from "../../domain/activity/queries/activity-comments/activity-comments.query";
import { classLevelThemesQueryResolver } from "../../domain/teacher/queries/class-level-themes/class-level-themes.query";
import { newslettersActiveQueryResolver, newsletterQueryResolver } from "../../domain/newsletter/queries/newsletter.query";
import { availableActivitiesForCycleResolver } from "../../domain/activity/queries/cycle/available-activities-for-cycle.query";
import { getLearningMoreLevelCodeCalculatorResolver } from "../../domain/level-code/learning-more-level-code-calculator.query";
import { viewerTeacherClassesQueryResolver } from "../../domain/teacher/queries/viewer-teacher-classes/viewer-teacher-classes.query";
import { viewerTeacherLevelCodesQueryResolver } from "../../domain/teacher/queries/viewer-teacher-level-codes/viewer-teacher-level-codes.query";
import { teacherClassesActivatedQueryResolver } from "../../domain/teacher/queries/teacher-classes-activated/teacher-classes-activated.resolvers";
import { activitiesListProgressQueryResolver } from "../../domain/activity/queries/activities-list-on-progress-order/activities-list-on-progress-order.query";
import { overallClassCompletedActivitiesQueryResolver } from "../../domain/teacher/queries/overall-class-completed-activities/overall-class-completed-activities.query";
import { activityTimerQueryResolver } from "../../domain/activity/queries/activity/activity-timer.query";

export const queryResolvers: GQLResolvers['Query'] = {
    logs: logQueryResolver,
    user: userQueryResolver,
    cycle: cycleQueryResolver,
    class: classQueryResolver,
    count: countQueryResolver,
    theme: themeQueryResolver,
    level: levelQueryResolver,
    Carrer: getCarrersResolver,
    meet: getMeetQueryResolver,
    backup: backupQueryResolver,
    config: configQueryResolver,
    cycles: cyclesQueryResolver,
    themes: themesQueryResolver,
    levels: levelsQueryResolver,
    classes: classesQueryResolver,
    avatars: avatarsQueryResolver,
    icons: themeIconsQueryResolver,
    myLevels: myLevelQueryResolver,
    activity: activityQueryResolver,
    userRole: userRoleQueryResolver,
    interest: interestQueryResolver,
    getZoom: getZoomUrlQueryResolver,
    userRoles: userRolesQueryResolver,
    challenge: challengeQueryResolver,
    challenges: challengesQueryResolver,
    chatHeader: chatHeaderQueryResolver,
    activities: activitiesQueryResolver,
    Annotation: annotationQueryResolver,
    newsletter: newsletterQueryResolver,
    levelTheme: levelThemeQueryResolver,
    occLogin: callOccLoginQueryResolver,
    themeTotal: themeTotalQueryResolver,
    levelCodes: levelCodesQueryResolver,
    Annotations: annotationsQueryResolver,
    newsletters: newslettersQueryResolver,
    chatMessage: chatMessageQueryResolver,
    currentUser: currentUserQueryResolver,
    levelThemes: levelThemesQueryResolver,
    classCycles: classCyclesQueryResolver,
    chatStudents: chatStudentsQueryResolver,
    availableThemes: availableThemesResolver,
    activityTimer: activityTimerQueryResolver,
    classStudents: classStudentsQueryResolver,
    cycleActivity: cycleActivityQueryResolver,
    myEnrollments: myEnrollmentsQueryResolver,
    teacherClasses: teacherClassesQueryResolver,
    getServiceNow: getServiceNowUrlQueryResolver,
    activeChallenge: activeChallengeQueryResolver,
    cycleActivities: cycleActivitiesQueryResolver,
    chatNewMessages: chatNewMessagesQueryResolver,
    activityComments: activityCommentsQueryResolver,
    classLevelThemes: classLevelThemesQueryResolver,
    progressStudents: progressStudentsQueryResolver,
    chatNotifications: chatNotificationsQueryResolver,
    newslettersActive: newslettersActiveQueryResolver,
    viewerTeacherClasses: viewerTeacherClassesQueryResolver,
    viewerTeacherLevelCodes: viewerTeacherLevelCodesQueryResolver,
    teacherClassesActivated: teacherClassesActivatedQueryResolver,
    learningMoreOption: getLearningMoreLevelCodeCalculatorResolver,
    availableActivitiesForCycle: availableActivitiesForCycleResolver,
    activitiesListByProgressOrder: activitiesListProgressQueryResolver,
    viewerEnrollmentLevelCodes: viewerEnrollmentLevelCodesQueryResolver,
    overallClassCompletedActivities: overallClassCompletedActivitiesQueryResolver,
}
