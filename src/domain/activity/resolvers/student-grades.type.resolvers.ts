import { GQLStudentGradeResolvers } from "../../../resolvers-types";

export const studentGradesResolvers: GQLStudentGradeResolvers = {
    grade: obj => {
        // clamp the value here since it is possible the query counts old activities that may end up accounting for more than 100%
        if (obj.grade > 100) {
            return 100;
        }
        return obj.grade;
    },
    typeId: obj => obj.typeId,
}
