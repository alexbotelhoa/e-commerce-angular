import { GQLMeetingResolvers } from "../../resolvers-types";
import { MeetingEntity } from "../../entities/meeting.entity";
import { getClassById } from "../repositories/class.repository";
import { getLevelCodeById } from "../repositories/level-code.repository";
import { selectTeacherClass } from "../repositories/teacher-class.repository";
import { getUserById } from "../repositories/user.repository";


export const meetingEntityResolvers: Pick<GQLMeetingResolvers, keyof MeetingEntity> = {
    id: obj => obj.id.toString(),
    classId: obj => obj.classId,
    date: obj => obj.date,
    endHour: obj => obj.endHour,
    objetive: obj => obj.objetive,
    startHour: obj => obj.startHour,

}


export const meetingResolvers: GQLMeetingResolvers = {
    ...meetingEntityResolvers,
    courseName: async (meet, b, context) => {
        const teacherClass = (await selectTeacherClass(context.database).where(`classId`, "=", meet.classId))[0]
        const classA = await getClassById(context.database)(teacherClass.classId)
        return classA?.levelCodeId ? (await getLevelCodeById(context.database)(classA.levelCodeId))?.code || null : null
    },
    teacherName: async (meet, b, context) => {
        const teacherClass = (await selectTeacherClass(context.database).where(`classId`, "=", meet.classId))[0]
        const teacher = await getUserById(context.database)(teacherClass.teacherId)
        return teacher?.name || ""
    },
}
