import { GQLResolvers } from "../../resolvers-types";
import { countQueryResolver } from "../../domain/count/count.resolver";
import { chatQueryResolver } from "../../domain/chat/query/chat.query";
import { logQueryResolver } from "../../domain/log/queries/log.resolver";
import { getMeetQueryResolver } from "../../domain/meeting/get-meet.resolver";
import { classQueryResolver } from "../../domain/activity/queries/class/class.query";
import { levelQueryResolver } from "../../domain/activity/queries/level/level.query";
import { themeQueryResolver } from "../../domain/activity/queries/theme/theme.query";
import { cycleQueryResolver } from "../../domain/activity/queries/cycle/cycle.query";
import { getCarrersResolver } from "../../domain/carrer/carrer-permissions.resolver";
import { chatMessageQueryResolver } from "../../domain/chat/query/chat-message.query";
import { levelsQueryResolver } from "../../domain/activity/queries/levels/levels.query";
import { themesQueryResolver } from "../../domain/activity/queries/themes/themes.query";
import { cyclesQueryResolver } from "../../domain/activity/queries/cycles/cycles.query";
import { backupQueryResolver } from '../../domain/activity/queries/backup/backup.query';
import { getZoomUrlQueryResolver } from "../../domain/user/query/get-zoom-url.resolver";
import { classesQueryResolver } from "../../domain/activity/queries/class/classes.query";
import { avatarsQueryResolver } from "../../domain/avatar/queries/avatars/avatars.query";
import { themeIconsQueryResolver } from "../../domain/activity/queries/icons/icons.query";
import { availableThemesResolver } from "../../domain/activity/queries/level/level.query";
import { activityQueryResolver } from "../../domain/activity/queries/activity/activity.query";
import { interestQueryResolver } from "../../domain/activity/queries/interest/interest.query";
import { annotationQueryResolver } from "../../domain/annotation/queries/annotation.resolver";
import { chatNewMessagesQueryResolver } from "../../domain/chat/query/chat-new-messages.query";
import { myLevelQueryResolver } from "../../domain/activity/queries/my-levels/my-levels.query";
import { userRoleQueryResolver } from "../../domain/activity/queries/user-role/user-role.query";
import { annotationsQueryResolver } from "../../domain/annotation/queries/annotations.resolver";
import { challengeQueryResolver } from "../../domain/activity/queries/challenge/challenge.query";
import { getServiceNowUrlQueryResolver } from "../../domain/user/query/get-service-now.resolver";
import { userRolesQueryResolver } from "../../domain/activity/queries/user-role/user-roles.query";
import { currentUserQueryResolver } from "../../domain/authentication/queries/current-user.query";
import { themeTotalQueryResolver } from "../../domain/theme/resolvers/theme.total-parts.resolvers";
import { activitiesQueryResolver } from "../../domain/activity/queries/activities/activities.query";
import { challengesQueryResolver } from "../../domain/activity/queries/challenges/challenges.query";
import { levelThemeQueryResolver } from "../../domain/activity/queries/level-theme/level-theme.query";
import { levelCodesQueryResolver } from "../../domain/activity/queries/level-codes/level-codes.query";
import { newslettersQueryResolver } from "../../domain/activity/queries/newsletters/newsletters.query";
import { chatStudentMessagesQueryResolver } from "../../domain/chat/query/chat-student-messages.query";
import { classCyclesQueryResolver } from "../../domain/teacher/queries/class-cycles/class-cycles.query";
import { callOccLoginQueryResolver } from "../../domain/material/queries/material-integration.resolver";
import { levelThemesQueryResolver } from "../../domain/activity/queries/level-themes/level-themes.query";
import { classStudentsQueryResolver } from "../../domain/teacher/queries/class-students/class-students.query";
import { myEnrollmentsQueryResolver } from "../../domain/activity/queries/my-enrollments/my-enrollments.query";
import { cycleActivityQueryResolver } from "../../domain/activity/queries/cycle-activity/cycle-activity.query";
import { teacherClassesQueryResolver } from "../../domain/teacher/queries/teacher-classes/teacher-classes.query";
import { activeChallengeQueryResolver } from "../../domain/activity/queries/active-challenge/active-challenge.query";
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
import { chatNotificationsQueryResolver } from "../../domain/chat/query/chat-notifications.query";

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
    challenge: challengeQueryResolver,
    challenges: challengesQueryResolver,
    activeChallenge: activeChallengeQueryResolver,
    class: classQueryResolver,
    overallClassCompletedActivities: overallClassCompletedActivitiesQueryResolver,
    classLevelThemes: classLevelThemesQueryResolver,
    classCycles: classCyclesQueryResolver,
    themeTotal: themeTotalQueryResolver,
    teacherClassesActivated: teacherClassesActivatedQueryResolver,
    viewerEnrollmentLevelCodes: viewerEnrollmentLevelCodesQueryResolver,
    progressStudents: progressStudentsQueryResolver,
    interest: interestQueryResolver,
    Annotation: annotationQueryResolver,
    newsletter: newsletterQueryResolver,
    newsletters: newslettersQueryResolver,
    newslettersActive: newslettersActiveQueryResolver,
    meet: getMeetQueryResolver,
    getZoom: getZoomUrlQueryResolver,
    logs: logQueryResolver,
    count: countQueryResolver,
    getServiceNow: getServiceNowUrlQueryResolver,
    Carrer: getCarrersResolver,
    learningMoreOption: getLearningMoreLevelCodeCalculatorResolver,
    activitiesListByProgressOrder: activitiesListProgressQueryResolver,
    Annotations: annotationsQueryResolver,
    occLogin: callOccLoginQueryResolver,
    backup: backupQueryResolver,
    userRole: userRoleQueryResolver,
    userRoles: userRolesQueryResolver,
    chat: chatQueryResolver,
    chatMessage: chatMessageQueryResolver,
    chatStudentMessages: chatStudentMessagesQueryResolver,
    chatNewMessages: chatNewMessagesQueryResolver,
    chatNotifications: chatNotificationsQueryResolver,
}
