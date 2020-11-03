import { GQLClassStudentGradeResolvers } from "../../../../resolvers-types";
import { GradeTypeId } from "../../enums/grade-type-id.enum";

export const classStudentGradeResolvers: GQLClassStudentGradeResolvers = {
    studentId: obj => obj.studentId,
    completionGrade: obj => obj.completionGrade || 0,
    completedActivities: obj => obj.completedActivities || 0,
    totalActivities: obj => obj.totalActivities || 0,
    completedProgressChecks: obj => obj.completedProgressChecks || 0,
    totalProgressChecks: obj => obj.totalProgressChecks || 0,
    progressCheckGrade: obj => obj.progressCheckGrade || 0,
    grades: obj => ([
        {
            typeId: GradeTypeId.VIEW,
            grade: obj.completionGrade || 0,
        },
        {
            typeId: GradeTypeId.COMPLETION,
            grade: obj.progressCheckGrade || 0,
        },
    ])
}
