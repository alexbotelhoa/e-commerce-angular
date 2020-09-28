import { GQLOverallClassCompletedActivitiesResolvers } from "../../../../resolvers-types";

export interface OverallClassCompletedActivities {
    classId: number;
    totalActivities: number;
    completedActivities: number;
    totalStudents: number;
    overallCompletion: number;
}

export const overallClassCompletedActivitiesResolvers: GQLOverallClassCompletedActivitiesResolvers = {
    classId: obj => obj.classId.toString(),
    completedActivities: obj => obj.completedActivities || 0,
    overallCompletion: obj => obj.overallCompletion || 0,
    totalActivities: obj => obj.totalActivities || 0,
    totalStudents: obj => obj.totalStudents || 0,
}
