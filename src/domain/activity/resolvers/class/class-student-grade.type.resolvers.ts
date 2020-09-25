import { GQLClassStudentGradeResolvers } from "../../../../resolvers-types";
import { GradeTypeId } from "../../enums/grade-type-id.enum";

export const classStudentGradeResolvers: GQLClassStudentGradeResolvers = {
    studentId: obj => obj.studentId,
    viewGrade: obj => obj.viewGrade || 0,
    completionGrade: obj => obj.completionGrade || 0,
    completedActivities: obj => obj.completedActivities || 0,
    totalActivities: obj => obj.totalActivities || 0,
    viewedActivities: obj => obj.viewedActivities || 0,
    grades: obj => ([
        {
            typeId: GradeTypeId.VIEW,
            grade: obj.viewGrade || 0,
        },
        {
            typeId: GradeTypeId.COMPLETION,
            grade: obj.completionGrade || 0,
        },
    ])
}
