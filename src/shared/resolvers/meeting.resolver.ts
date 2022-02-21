import { GQLMeetingResolvers } from "../../resolvers-types";
import { MeetingEntity } from "../../entities/meeting.entity";
import { getUserById } from "../repositories/user.repository";
import { getClassById } from "../repositories/class.repository";
import { getLevelCodeById } from "../repositories/level-code.repository";
import { selectTeacherClass } from "../repositories/teacher-class.repository";

const meetingEntityResolvers: Pick<GQLMeetingResolvers, keyof MeetingEntity> = {
    id: obj => obj.id.toString(),
    classId: obj => obj.classId,
    date: obj => obj.date,
    endHour: obj => obj.endHour,
    objetive: obj => obj.objetive,
    startHour: obj => obj.startHour,
    attendTmpltNbr: obj => obj.attendTmpltNbr,
    enabled: obj => obj.enabled,
    facilityId: obj => obj.facilityId,
    teacherNotes: obj => obj.teacherNotes,
    homework: obj => obj.homework
}

export const meetingResolvers: GQLMeetingResolvers = {
    ...meetingEntityResolvers,
    courseName: async (meet, b, context) => {
        const teacherClass = (await selectTeacherClass(context.database).where(`classId`, "=", meet.classId).first())
        if (teacherClass) {
            const classA = await getClassById(context.database)(teacherClass.classId)
            return classA?.levelCodeId ? (await getLevelCodeById(context.database)(classA.levelCodeId))?.code || "" : ""
        }
        return "";
    },
    teacherName: async (meet, b, context) => {
        const teacherClass = (await selectTeacherClass(context.database).where(`classId`, "=", meet.classId).first())
        if (teacherClass) {
            const teacher = await getUserById(context.database)(teacherClass.teacherId)
            return teacher?.name || ""
        }
        return "";
    },
}
