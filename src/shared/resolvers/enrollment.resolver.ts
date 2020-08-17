import { GQLEnrollmentResolvers } from "../../resolvers-types";
import { EnrollmentEntity } from "../../entities/enrollment.entity";

export const enrollmentEntityResolvers: Pick<GQLEnrollmentResolvers, keyof EnrollmentEntity> = {
    id: obj => obj.id.toString(10),
    classId: obj => obj.classId.toString(10),
    userId: obj => obj.userId.toString(10),
}

export const enrollmentResolvers: GQLEnrollmentResolvers = {
    ...enrollmentEntityResolvers,
}
