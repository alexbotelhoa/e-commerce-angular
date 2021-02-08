import { GQLstudentLevelResolvers } from "../../resolvers-types";


export const studentLevelResolvers: GQLstudentLevelResolvers = {
    totalCompletedActivities: (obj) => obj.totalCompletedActivities,
}
