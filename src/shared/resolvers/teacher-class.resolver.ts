import { GQLTeacherClassResolvers } from "../../resolvers-types";
import { TeacherClassEntity } from "../../entities/teacher-class.entity";

export const teacherClassEntityResolvers: Pick<GQLTeacherClassResolvers, keyof TeacherClassEntity> = {
    id: obj => obj.id.toString(10),
    classId: obj => obj.classId.toString(10),
    teacherId: obj => obj.teacherId.toString(10),
}

export const teacherClassResolvers: GQLTeacherClassResolvers = {
    ...teacherClassEntityResolvers,
}
