import { GQLResolvers, ActivityTypeId } from "./resolvers-types";

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

export type InterfaceResolverKeys = 'Activity' | 'ActivityData';

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
    RoleId: RoleId,
    PermissionId: PermissionId,
    EmbeddedActivity: embeddedActivityResolvers,
    HtmlActivity: htmlActivityResolvers,
    Role: roleResolvers,
    Permission: permissionResolvers,
    ActivityType: activityTypeResolvers,
    UserRole: userRoleResolvers,
    Theme: themeResolvers,
    EmbeddedActivityData: embeddedActivityDataResolvers,
    HtmlActivityData: htmlActivityDataResolvers,
    DateTime: dateTimeScalarResolver,
};



