import { GQLMeetingResolvers, GQLUserRoleResolvers } from "../../resolvers-types";
import { UserRoleEntity } from "../../entities/user-role.entity";
import { getRoleById } from "../../domain/authorization/constants/roles.constants";
import { getUserById } from "../repositories/user.repository";
import { MeetingEntity } from "../../entities/meeting.entity";
import { ClassEntity } from "../../entities/class.entity";
import { getClassesByIds } from "../repositories/class.repository";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { createDataloaderSingleSort } from "../utils/dataloader-single-sort";

const teacherClassClassByClassIdSorter = createDataloaderSingleSort<ClassEntity, string, ClassEntity>('id');

export const MeetingClassByClassIdLoader: DatabaseLoaderFactory<string, ClassEntity, ClassEntity> = {
    id: 'MeetingClassByClassIdLoader',
    batchFn: (db) => async (ids) => {
        const entities = await getClassesByIds(db)(ids);
        const sorted = teacherClassClassByClassIdSorter(ids)(entities);
        return sorted;
    }
}
export const meetingEntityResolvers: Pick<GQLMeetingResolvers, keyof MeetingEntity> = {
    id: obj => obj.id.toString(),
    classId: obj => obj.classId,
    date: obj => obj.date,
    endHour: obj => obj.endHour,
    objetive: obj => obj.objetive,
    startHour: obj => obj.startHour
}


export const meetingResolvers: GQLMeetingResolvers = {
    ...meetingEntityResolvers
}
