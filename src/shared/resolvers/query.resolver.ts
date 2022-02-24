import { GQLResolvers } from "../../resolvers-types";
import { countQueryResolver } from "../../domain/count/count.resolver";
import { logQueryResolver } from "../../domain/log/queries/log.resolver";
import { getMeetQueryResolver } from "../../domain/meeting/get-meet.resolver";
import { classQueryResolver } from "../../domain/class/class.query";
import { levelQueryResolver } from "../../domain/activity/queries/level/level.query";
import { themeQueryResolver } from "../../domain/activity/queries/theme/theme.query";
import { cycleQueryResolver } from "../../domain/activity/queries/cycle/cycle.query";
import { getCarrersResolver } from "../../domain/carrer/carrer-permissions.resolver";
import { chatHeaderQueryResolver } from "../../domain/chat/queries/chat-header.query";
import { levelsQueryResolver } from "../../domain/activity/queries/levels/levels.query";
import { themesQueryResolver } from "../../domain/activity/queries/themes/themes.query";
import { cyclesQueryResolver } from "../../domain/activity/queries/cycles/cycles.query";
import { backupQueryResolver } from '../../domain/backup/backup.query';
import { getZoomUrlQueryResolver } from "../../domain/user/query/get-zoom-url.resolver";
import { chatMessageQueryResolver } from "../../domain/chat/queries/chat-message.query";
import { classesQueryResolver } from "../../domain/class/classes.query";
import { avatarsQueryResolver } from "../../domain/avatar/queries/avatars/avatars.query";
import { themeIconsQueryResolver } from "../../domain/activity/queries/icons/icons.query";
import { availableThemesResolver } from "../../domain/activity/queries/level/level.query";
import { chatStudentsQueryResolver } from "../../domain/chat/queries/chat-students.query";
import { activityQueryResolver } from "../../domain/activity/queries/activity/activity.query";
import { interestQueryResolver } from "../../domain/interest/interest.query";
import { annotationQueryResolver } from "../../domain/annotation/queries/annotation.resolver";
import { myLevelQueryResolver } from "../../domain/my-levels/my-levels.query";
import { userRoleQueryResolver } from "../../domain/user-role/user-role.query";
import { annotationsQueryResolver } from "../../domain/annotation/queries/annotations.resolver";
import { chatNewMessagesQueryResolver } from "../../domain/chat/queries/chat-new-messages.query";
import { challengeQueryResolver } from "../../domain/activity/queries/challenge/challenge.query";
import { getServiceNowUrlQueryResolver } from "../../domain/user/query/get-service-now.resolver";
import { userRolesQueryResolver } from "../../domain/user-role/user-roles.query";
import { currentUserQueryResolver } from "../../domain/authentication/queries/current-user.query";
import { themeTotalQueryResolver } from "../../domain/theme/resolvers/theme.total-parts.resolvers";
import { activitiesQueryResolver } from "../../domain/activity/queries/activities/activities.query";
import { challengesQueryResolver } from "../../domain/challenge/queries/challenges.query";
import { chatNotificationsQueryResolver } from "../../domain/chat/queries/chat-notifications.query";
import { levelThemeQueryResolver } from "../../domain/activity/queries/level-theme/level-theme.query";
import { levelCodesQueryResolver } from "../../domain/activity/queries/level-codes/level-codes.query";
import { newslettersQueryResolver } from "../../domain/newsletter/queries/newsletters.query";
import { classCyclesQueryResolver } from "../../domain/teacher/queries/class-cycles/class-cycles.query";
import { callOccLoginQueryResolver } from "../../domain/material/queries/material-integration.resolver";
import { levelThemesQueryResolver } from "../../domain/activity/queries/level-themes/level-themes.query";
import { classStudentsQueryResolver } from "../../domain/teacher/queries/class-students/class-students.query";
import { myEnrollmentsQueryResolver } from "../../domain/my-enrollments/my-enrollments.query";
import { cycleActivityQueryResolver } from "../../domain/activity/queries/cycle-activity/cycle-activity.query";
import { teacherClassesQueryResolver } from "../../domain/teacher/queries/teacher-classes/teacher-classes.query";
import { activeChallengeQueryResolver } from "../../domain/challenge/queries/activity-challenge.query";
import { cycleActivitiesQueryResolver } from "../../domain/activity/queries/cycle-activities/cycle-activities.query";
import { progressStudentsQueryResolver } from "../../domain/teacher/queries/progress-students/progress-students.query";
import { activityCommentsQueryResolver } from "../../domain/activity/queries/activity-comments/activity-comments.query";
import { classLevelThemesQueryResolver } from "../../domain/teacher/queries/class-level-themes/class-level-themes.query";
import { availableActivitiesForCycleResolver } from "../../domain/activity/queries/cycle/available-activities-for-cycle.query";
import { newslettersActiveQueryResolver, newsletterQueryResolver } from "../../domain/activity/queries/newsletter/newsletter.query";
import { viewerTeacherClassesQueryResolver } from "../../domain/teacher/queries/viewer-teacher-classes/viewer-teacher-classes.query";
import { getLearningMoreLevelCodeCalculatorResolver } from "../../domain/level-code/queries/learning-more-level-code-calculator.resolver";
import { viewerTeacherLevelCodesQueryResolver } from "../../domain/teacher/queries/viewer-teacher-level-codes/viewer-teacher-level-codes.query";
import { teacherClassesActivatedQueryResolver } from "../../domain/teacher/queries/teacher-classes-activated/teacher-classes-activated.resolvers";
import { viewerEnrollmentLevelCodesQueryResolver } from "../../domain/enrollment/queries/viewer-enrollment-level-codes/viewer-enrollment-level-codes.query";
import { activitiesListProgressQueryResolver } from "../../domain/activity/queries/activities-list-on-progress-order/activities-on-list-on-progress-order.resolver";
import { overallClassCompletedActivitiesQueryResolver } from "../../domain/teacher/queries/overall-class-completed-activities/overall-class-completed-activities.query";

export const queryResolvers: GQLResolvers['Query'] = {
    logs: logQueryResolver,
    cycle: cycleQueryResolver,
    class: classQueryResolver,
    count: countQueryResolver,
    theme: themeQueryResolver,
    level: levelQueryResolver,
    Carrer: getCarrersResolver,
    meet: getMeetQueryResolver,
    backup: backupQueryResolver,
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
