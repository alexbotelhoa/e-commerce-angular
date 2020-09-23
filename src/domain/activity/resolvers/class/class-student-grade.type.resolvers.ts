import { GQLClassStudentGradeResolvers } from "../../../../resolvers-types";

export const classStudentGradeResolvers: GQLClassStudentGradeResolvers = {
    studentId: obj => obj.studentId,
    viewGrade: obj => obj.viewGrade || 0,
    completionGrade: obj => obj.completionGrade || 0,
    completedActivities: obj => obj.completedActivities || 0,
    totalActivities: obj => obj.totalActivities || 0,
    viewedActivities: obj => obj.viewedActivities || 0,
}
