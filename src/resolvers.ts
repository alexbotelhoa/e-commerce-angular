import { GQLResolvers, ActivityTypeId, LevelTypeId } from "./resolvers-types";

import { mutationResolvers } from "./shared/resolvers/mutation.resolvers"
import { queryResolvers } from "./shared/resolvers/query.resolvers"

import { userResolvers } from "./shared/resolvers/user.resolvers"
import { cycleResolvers } from "./shared/resolvers/cycle.resolvers"
import { levelResolvers } from "./shared/resolvers/level.resolvers"
import { levelThemeResolvers } from "./shared/resolvers/level-theme.resolvers"
import { cycleActivityResolvers } from "./shared/resolvers/cycle-activity.resolvers"

import { activityUnionResolvers } from "./domain/activity/types/activity.union";
import { embeddedActivityResolvers } from "./domain/activity/types/activity-types/embedded/embedded-activity.resolvers";
import { htmlActivityResolvers } from "./domain/activity/types/activity-types/html/html-activity.resolvers";
import { RoleId } from "./domain/authorization/enums/role-id.enum";
import { roleResolvers } from "./domain/authorization/types/role.type.resolvers";
import { permissionResolvers } from "./domain/authorization/types/permission.type.resolvers";
import { PermissionId } from "./domain/authorization/enums/permission-id.enum";
import { levelCodeResolvers } from "./shared/resolvers/level-code.resolvers";
import { activityTypeResolvers } from "./shared/resolvers/activity-type.resolvers";
import { userRoleResolvers } from "./shared/resolvers/user-role.resolvers";
import { themeResolvers } from "./shared/resolvers/theme.resolvers";
import { embeddedActivityDataResolvers } from "./domain/activity/types/activity-types/embedded/embedded-activity-data.resolvers";
import { htmlActivityDataResolvers } from "./domain/activity/types/activity-types/html/html-activity-data.resolvers";
import { dateTimeScalarResolver } from "./shared/scalars/datetime.scalar";
import { themeIconResolvers } from "./shared/resolvers/theme-icon.resolvers";
import { classResolvers } from "./shared/resolvers/class.resolvers";
import { enrollmentResolvers } from "./shared/resolvers/enrollment.resolver";
import { activityCommentResolvers } from "./shared/resolvers/activity-comment.resolvers";
import { activityTimerResolvers } from "./shared/resolvers/activity-timer.resolvers";
import { teacherClassResolvers } from "./shared/resolvers/teacher-class.resolver";
import { simpleErrorResolvers } from "./shared/resolvers/simple-error.resolver";
import { avatarResolvers } from "./shared/resolvers/avatar.resolvers";
import { createCommentOnActivityResultResolver } from "./domain/activity/mutations/create-comment-on-activity/create-comment-on-activity.mutation";
import { deleteActivityCommentResultResolver } from "./domain/activity/mutations/delete-activity-comment/delete-activity-comment.mutation";
import { enrollmentClassResolvers } from "./shared/resolvers/enrollment-class.resolver";
import { DeleteActivityCommentSuccessResultResolvers } from "./domain/activity/mutations/delete-activity-comment/delete-activity-comment-success-result.type";
import { completeActivityResultResolver } from "./domain/activity/mutations/complete-activity/complete-activity.mutation";
import { startActivityResultResolver } from "./domain/activity/mutations/start-activity/start-activity.mutation";
import { viewerChangeAvatarMutationErrorResolvers, viewerChangeAvatarMutationResultResolvers } from "./domain/avatar/mutations/viewer-change-avatar/viewer-change-avatar.types";
import { challengeResolvers } from "./shared/resolvers/challenge.resolver";
import { classStudentGradeResolvers } from "./domain/activity/resolvers/class/class-student-grade.type.resolvers";

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
};



