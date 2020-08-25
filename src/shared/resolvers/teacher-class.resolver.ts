import { GQLTeacherClassResolvers } from "../../resolvers-types";
import { TeacherClassEntity } from "../../entities/teacher-class.entity";
import { getClassById } from "../repositories/class.repository";
import { getUserById } from "../repositories/user.repository"

export const teacherClassEntityResolvers: Pick<GQLTeacherClassResolvers, keyof TeacherClassEntity> = {
    id: obj => obj.id.toString(10),
    classId: obj => obj.classId.toString(10),
    teacherId: obj => obj.teacherId.toString(10),
}

const classesFieldResolver: GQLTeacherClassResolvers['class'] = async (obj, params, { database: db }) => {
    const teacherClass = await getClassById(db)(obj.classId);

    if (teacherClass) {
        return teacherClass;
    }

    throw new Error('Non-existent class entity!')
};

/* Teacher field is redundant (when querying from User field teacherClasses) */
const teacherFieldResolver: GQLTeacherClassResolvers['teacher'] = async (obj, params, { database: db }) => {
    const teacher = await getUserById(db)(obj.teacherId);

    if (teacher) {
        return teacher;
    }

    throw new Error('Non-existent user entity!')
};

export const teacherClassResolvers: GQLTeacherClassResolvers = {
    ...teacherClassEntityResolvers,
    teacher: teacherFieldResolver,
    class: classesFieldResolver
}
