import { GQLResolvers, ActivityTypeId } from "./resolvers-types";

import { mutationResolvers } from "./shared/resolvers/mutation.resolvers"
import { queryResolvers } from "./shared/resolvers/query.resolvers"
import { userResolvers } from "./shared/resolvers/user.resolvers"

import { activityUnionResolvers } from "./domain/activity/types/activity.union";
import { embeddedActivityResolvers } from "./domain/activity/types/activity-types/embedded/embedded-activity.resolvers";
import { htmlActivityResolvers } from "./domain/activity/types/activity-types/html/html-activity.resolvers";
import { RoleId } from "./domain/authorization/enums/role-id.enum";
import { roleResolvers } from "./domain/authorization/types/role.type.resolvers";
import { permissionResolvers } from "./domain/authorization/types/permission.type.resolvers";

export const resolvers: GQLResolvers = <GQLResolvers>{
    Query: queryResolvers,
    Mutation: mutationResolvers,
    User: userResolvers,
    ActivityUnion: activityUnionResolvers,
    ActivityTypeId: ActivityTypeId,
    RoleId: RoleId,
    EmbeddedActivity: embeddedActivityResolvers,
    HtmlActivity: htmlActivityResolvers,
    Role: roleResolvers,
    Permission: permissionResolvers,
};



