import { GQLStudentGradeResolvers } from "../../../resolvers-types";

export const studentGradesResolvers: GQLStudentGradeResolvers = {
    grade: obj => obj.grade,
    typeId: obj => obj.typeId,
}
