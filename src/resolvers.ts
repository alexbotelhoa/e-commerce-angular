import { GQLResolvers, ActivityTypeId, LevelTypeId } from "./resolvers-types";

import { queryResolvers } from "./shared/resolvers/query.resolvers";
import { mutationResolvers } from "./shared/resolvers/mutation.resolvers";

import { logResolver } from "./shared/resolvers/log.resolver";
import { chatResolvers } from "./shared/resolvers/chat.resolvers";
import { userResolvers } from "./shared/resolvers/user.resolvers";
import { countResolver } from "./shared/resolvers/count.resolver";
import { carrerResolver } from "./shared/resolvers/carrer.resolver";
import { cycleResolvers } from "./shared/resolvers/cycle.resolvers";
import { themeResolvers } from "./shared/resolvers/theme.resolvers";
import { levelResolvers } from "./shared/resolvers/level.resolvers";
import { classResolvers } from "./shared/resolvers/class.resolvers";
import { localResolvers } from "./shared/resolvers/local.resolvers";
import { campusResolvers } from "./shared/resolvers/campus.resolvers";
import { avatarResolvers } from "./shared/resolvers/avatar.resolvers";
import { backupResolvers } from './shared/resolvers/backup.resolvers';
import { meetingResolvers } from "./shared/resolvers/meeting.resolver";
import { regionalResolvers } from "./shared/resolvers/regional.resolvers";
import { dateTimeScalarResolver } from "./shared/scalars/datetime.scalar";
import { userRoleResolvers } from "./shared/resolvers/user-role.resolvers";
import { challengeResolvers } from "./shared/resolvers/challenge.resolver";
import { themeIconResolvers } from "./shared/resolvers/theme-icon.resolvers";
import { enrollmentResolvers } from "./shared/resolvers/enrollment.resolver";
import { levelCodeResolvers } from "./shared/resolvers/level-code.resolvers";
import { annotationResolvers } from "./shared/resolvers/annotation.resolver";
import { newsletterResolvers } from "./shared/resolvers/newsletter.resolver";
import { levelThemeResolvers } from "./shared/resolvers/level-theme.resolvers";
import { interestEntityResolvers } from "./shared/resolvers/interest.resolver";
import { simpleErrorResolvers } from "./shared/resolvers/simple-error.resolver";
import { studentMaterialResolver } from "./shared/resolvers/material.resolvers";
import { teacherClassResolvers } from "./shared/resolvers/teacher-class.resolver";
import { occLoginResolvers } from "./shared/resolvers/occ-call-to-login.resolver";
import { userInterestResolvers } from "./shared/resolvers/user-interest.resolver";
import { activityTypeResolvers } from "./shared/resolvers/activity-type.resolvers";
import { studentLevelResolvers } from "./shared/resolvers/student-level.resolvers";
import { cycleActivityResolvers } from "./shared/resolvers/cycle-activity.resolvers";
import { activityTimerResolvers } from "./shared/resolvers/activity-timer.resolvers";
import { enrollmentClassResolvers } from "./shared/resolvers/enrollment-class.resolver";
import { activityCommentResolvers } from "./shared/resolvers/activity-comment.resolvers";
import { carrerPermissionResolver } from "./shared/resolvers/carrer-permission.resolvers";
import { activitiesListResolver } from "./shared/resolvers/activities-on-list-on-progress-order.resolvers";

import { RoleId } from "./domain/authorization/enums/role-id.enum";
import { GradeTypeId } from "./domain/activity/enums/grade-type-id.enum";
import { PermissionId } from "./domain/authorization/enums/permission-id.enum";
import { activityUnionResolvers } from "./domain/activity/types/activity.union";
import { roleResolvers } from "./domain/authorization/types/role.type.resolvers";
import { chatMessageResolvers } from "./shared/resolvers/chat-message.resolvers";
import { themeTotalResolvers } from "./domain/theme/resolvers/theme.total-parts.resolvers";
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
import { DeleteActivityCommentSuccessResultResolvers } from "./domain/activity/mutations/delete-activity-comment/delete-activity-comment-success-result.type";
import { overallClassCompletedActivitiesResolvers } from "./domain/teacher/queries/overall-class-completed-activities/overall-class-completed-activities.type";
import { viewerChangeAvatarMutationErrorResolvers, viewerChangeAvatarMutationResultResolvers } from "./domain/avatar/mutations/viewer-change-avatar/viewer-change-avatar.types";
import { classItemResolvers, levelCodeItemResolvers, teacherClassesActivatedResolvers } from "./domain/teacher/queries/teacher-classes-activated/teacher-classes-activated.resolvers";

export type InterfaceResolverKeys = 'Activity' | 'ActivityData' | 'Comment' | 'GenericError';

// We purposedly omit resolvers for interfaces, which are supported by makeExecutableSchema but not required
export const resolvers: Omit<GQLResolvers, InterfaceResolverKeys> = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    User: userResolvers,
    Cycle: cycleResolvers,
    Level: levelResolvers,
    LevelTheme: levelThemeResolvers,
    LevelCode: levelCodeResolvers,
    CycleActivity: cycleActivityResolvers,
    ActivityUnion: activityUnionResolvers,
    ActivityTypeId: ActivityTypeId,
    LevelTypeId: LevelTypeId,
    RoleId: RoleId,
    PermissionId: PermissionId,
    EmbeddedActivity: embeddedActivityResolvers,
    HtmlActivity: htmlActivityResolvers,
    Role: roleResolvers,
    Permission: permissionResolvers,
    ActivityType: activityTypeResolvers,
    UserRole: userRoleResolvers,
    Theme: themeResolvers,
    ThemeIcon: themeIconResolvers,
    EmbeddedActivityData: embeddedActivityDataResolvers,
    HtmlActivityData: htmlActivityDataResolvers,
    DateTime: dateTimeScalarResolver,
    Class: classResolvers,
    Enrollment: enrollmentResolvers,
    ActivityComment: activityCommentResolvers,
    ActivityTimer: activityTimerResolvers,
    TeacherClass: teacherClassResolvers,
    SimpleError: simpleErrorResolvers,
    CreateCommentOnActivityResult: createCommentOnActivityResultResolver,
    DeleteActivityCommentResult: deleteActivityCommentResultResolver,
    EnrollmentClass: enrollmentClassResolvers,
    DeleteActivityCommentSuccessResult: DeleteActivityCommentSuccessResultResolvers,
    CompleteActivityResult: completeActivityResultResolver,
    StartActivityResult: startActivityResultResolver,
    Avatar: avatarResolvers,
    ViewerChangeAvatarMutationError: viewerChangeAvatarMutationErrorResolvers,
    ViewerChangeAvatarMutationResult: viewerChangeAvatarMutationResultResolvers,
    Challenge: challengeResolvers,
    ClassStudentGrade: classStudentGradeResolvers,
    StudentGrade: studentGradesResolvers,
    GradeTypeId: GradeTypeId,
    OverallClassCompletedActivities: overallClassCompletedActivitiesResolvers,
    ThemeTotal: themeTotalResolvers,
    TeacherClassesActivated: teacherClassesActivatedResolvers,
    ClassItem: classItemResolvers,
    LevelCodeItem: levelCodeItemResolvers,
    Campus: campusResolvers,
    Local: localResolvers,
    Regional: regionalResolvers,
    ProgressStudent: progressStudentsResolver,
    Interest: interestEntityResolvers,
    UserInterest: userInterestResolvers,
    studentLevel: studentLevelResolvers,
    Meeting: meetingResolvers,
    Annotation: annotationResolvers,
    Newsletter: newsletterResolvers,
    Log: logResolver,
    Count: countResolver,
    Carrer: carrerResolver,
    CarrerPermission: carrerPermissionResolver,
    ActivitiesListByProgressOrder: activitiesListResolver,
    Material: studentMaterialResolver,
    OccResult: occLoginResolvers,
    Backup: backupResolvers,
    Chat: chatResolvers,
    ChatMessage: chatMessageResolvers,
};
