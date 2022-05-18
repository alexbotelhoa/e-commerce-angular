import { GQLResolvers, ActivityTypeId, LevelTypeId } from "./resolvers-types";

import { queryResolvers } from "./shared/resolvers/query.resolver";
import { mutationResolvers } from "./shared/resolvers/mutation.resolver";

import { logResolver } from "./shared/resolvers/log.resolver";
import { chatResolvers } from "./shared/resolvers/chat.resolver";
import { userResolvers } from "./shared/resolvers/user.resolver";
import { countResolvers } from "./shared/resolvers/count.resolver";
import { cycleResolvers } from "./shared/resolvers/cycle.resolver";
import { themeResolvers } from "./shared/resolvers/theme.resolver";
import { levelResolvers } from "./shared/resolvers/level.resolver";
import { classResolvers } from "./shared/resolvers/class.resolver";
import { localResolvers } from "./shared/resolvers/local.resolver";
import { configResolvers } from './shared/resolvers/config.resolver';
import { carrerResolvers } from "./shared/resolvers/carrer.resolver";
import { campusResolvers } from "./shared/resolvers/campus.resolver";
import { avatarResolvers } from "./shared/resolvers/avatar.resolver";
import { backupResolvers } from './shared/resolvers/backup.resolver';
import { meetingResolvers } from "./shared/resolvers/meeting.resolver";
import { regionalResolvers } from "./shared/resolvers/regional.resolver";
import { interestResolvers } from "./shared/resolvers/interest.resolver";
import { materialResolvers } from "./shared/resolvers/material.resolver";
import { userRoleResolvers } from "./shared/resolvers/user-role.resolver";
import { dateTimeScalarResolver } from "./shared/scalars/datetime.scalar";
import { challengeResolvers } from "./shared/resolvers/challenge.resolver";
import { themeIconResolvers } from "./shared/resolvers/theme-icon.resolver";
import { levelCodeResolvers } from "./shared/resolvers/level-code.resolver";
import { enrollmentResolvers } from "./shared/resolvers/enrollment.resolver";
import { annotationResolvers } from "./shared/resolvers/annotation.resolver";
import { newsletterResolvers } from "./shared/resolvers/newsletter.resolver";
import { levelThemeResolvers } from "./shared/resolvers/level-theme.resolver";
import { simpleErrorResolvers } from "./shared/resolvers/simple-error.resolver";
import { chatMessageResolvers } from "./shared/resolvers/chat-message.resolver";
import { teacherClassResolvers } from "./shared/resolvers/teacher-class.resolver";
import { occLoginResolvers } from "./shared/resolvers/occ-call-to-login.resolver";
import { userInterestResolvers } from "./shared/resolvers/user-interest.resolver";
import { activityTypeResolvers } from "./shared/resolvers/activity-type.resolver";
import { studentLevelResolvers } from "./shared/resolvers/student-level.resolver";
import { cycleActivityResolvers } from "./shared/resolvers/cycle-activity.resolver";
import { activityTimerResolvers } from "./shared/resolvers/activity-timer.resolver";
import { enrollmentClassResolvers } from "./shared/resolvers/enrollment-class.resolver";
import { activityCommentResolvers } from "./shared/resolvers/activity-comment.resolver";
import { carrerPermissionResolver } from "./shared/resolvers/carrer-permission.resolver";
import { activitiesListResolvers } from "./shared/resolvers/activities-on-list-on-progress-order.resolver";

import { RoleId } from "./domain/authorization/enums/role-id.enum";
import { GradeTypeId } from "./domain/activity/enums/grade-type-id.enum";
import { themeTotalResolvers } from "./domain/theme/theme.total-parts.query";
import { PermissionId } from "./domain/authorization/enums/permission-id.enum";
import { activityUnionResolvers } from "./domain/activity/types/activity.union";
import { roleResolvers } from "./domain/authorization/types/role.type.resolvers";
import { permissionResolvers } from "./domain/authorization/types/permission.type.resolvers";
import { studentGradesResolvers } from "./domain/activity/resolvers/student-grades.type.resolvers";
import { htmlActivityResolvers } from "./domain/activity/types/activity-types/html/html-activity.resolvers";
import { progressStudentsResolver } from "./domain/teacher/queries/progress-students/progress-students.query";
import { startActivityResultResolver } from "./domain/activity/mutations/start-activity/start-activity.mutation";
import { classStudentGradeResolvers } from "./domain/activity/resolvers/class/class-student-grade.type.resolvers";
import { htmlActivityDataResolvers } from "./domain/activity/types/activity-types/html/html-activity-data.resolvers";
import { embeddedActivityResolvers } from "./domain/activity/types/activity-types/embedded/embedded-activity.resolvers";
import { completeActivityResultResolver } from "./domain/activity/mutations/complete-activity/complete-activity.mutation";
import { embeddedActivityDataResolvers } from "./domain/activity/types/activity-types/embedded/embedded-activity-data.resolvers";
import { deleteActivityCommentResultResolver } from "./domain/activity/mutations/delete-activity-comment/delete-activity-comment.mutation";
import { createCommentOnActivityResultResolver } from "./domain/activity/mutations/create-comment-on-activity/create-comment-on-activity.mutation";
import { viewerChangeAvatarMutationErrorResolvers, viewerChangeAvatarMutationResultResolvers } from "./domain/avatar/mutations/viewer-change-avatar.types";
import { DeleteActivityCommentSuccessResultResolvers } from "./domain/activity/mutations/delete-activity-comment/delete-activity-comment-success-result.type";
import { overallClassCompletedActivitiesResolvers } from "./domain/teacher/queries/overall-class-completed-activities/overall-class-completed-activities.type";
import { classItemResolvers, levelCodeItemResolvers, teacherClassesActivatedResolvers } from "./domain/teacher/queries/teacher-classes-activated/teacher-classes-activated.resolvers";

export type InterfaceResolverKeys = 'Activity' | 'ActivityData' | 'Comment' | 'GenericError';

// We purposedly omit resolvers for interfaces, which are supported by makeExecutableSchema but not required
export const resolvers: Omit<GQLResolvers, InterfaceResolverKeys> = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    RoleId: RoleId,
    Log: logResolver,
    Chat: chatResolvers,
    User: userResolvers,
    Role: roleResolvers,
    Cycle: cycleResolvers,
    Class: classResolvers,
    Count: countResolvers,
    Level: levelResolvers,
    Local: localResolvers,
    Theme: themeResolvers,
    Avatar: avatarResolvers,
    Backup: backupResolvers,
    Carrer: carrerResolvers,
    Campus: campusResolvers,
    Config: configResolvers,
    GradeTypeId: GradeTypeId,
    LevelTypeId: LevelTypeId,
    Meeting: meetingResolvers,
    PermissionId: PermissionId,
    Regional: regionalResolvers,
    Interest: interestResolvers,
    Material: materialResolvers,
    UserRole: userRoleResolvers,
    OccResult: occLoginResolvers,
    ClassItem: classItemResolvers,
    Challenge: challengeResolvers,
    LevelCode: levelCodeResolvers,
    ThemeIcon: themeIconResolvers,
    ActivityTypeId: ActivityTypeId,
    Annotation: annotationResolvers,
    Enrollment: enrollmentResolvers,
    LevelTheme: levelThemeResolvers,
    Permission: permissionResolvers,
    ThemeTotal: themeTotalResolvers,
    Newsletter: newsletterResolvers,
    DateTime: dateTimeScalarResolver,
    ChatMessage: chatMessageResolvers,
    SimpleError: simpleErrorResolvers,
    ActivityType: activityTypeResolvers,
    HtmlActivity: htmlActivityResolvers,
    UserInterest: userInterestResolvers,
    studentLevel: studentLevelResolvers,
    TeacherClass: teacherClassResolvers,
    StudentGrade: studentGradesResolvers,
    ActivityUnion: activityUnionResolvers,
    ActivityTimer: activityTimerResolvers,
    CycleActivity: cycleActivityResolvers,
    LevelCodeItem: levelCodeItemResolvers,
    ActivityComment: activityCommentResolvers,
    EnrollmentClass: enrollmentClassResolvers,
    ProgressStudent: progressStudentsResolver,
    CarrerPermission: carrerPermissionResolver,
    EmbeddedActivity: embeddedActivityResolvers,
    HtmlActivityData: htmlActivityDataResolvers,
    ClassStudentGrade: classStudentGradeResolvers,
    StartActivityResult: startActivityResultResolver,
    EmbeddedActivityData: embeddedActivityDataResolvers,
    CompleteActivityResult: completeActivityResultResolver,
    ActivitiesListByProgressOrder: activitiesListResolvers,
    TeacherClassesActivated: teacherClassesActivatedResolvers,
    DeleteActivityCommentResult: deleteActivityCommentResultResolver,
    CreateCommentOnActivityResult: createCommentOnActivityResultResolver,
    OverallClassCompletedActivities: overallClassCompletedActivitiesResolvers,
    ViewerChangeAvatarMutationError: viewerChangeAvatarMutationErrorResolvers,
    ViewerChangeAvatarMutationResult: viewerChangeAvatarMutationResultResolvers,
    DeleteActivityCommentSuccessResult: DeleteActivityCommentSuccessResultResolvers,
};
