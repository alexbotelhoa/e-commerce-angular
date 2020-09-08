import { GQLQueryResolvers } from "../../../../resolvers-types";
import { USER_TABLE, UserEntity } from "../../../../entities/user.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../../../entities/enrollment-class.entity";
import { ENROLLMENT_TABLE } from "../../../../entities/enrollment.entity";

export const classStudentsQueryResolver: GQLQueryResolvers['classStudents'] = async (obj, { data }, context) => {
    return context.database<UserEntity, UserEntity[]>(USER_TABLE)
        .distinct(`${USER_TABLE}.*`)
        .from(USER_TABLE)
        .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.userId`, `${USER_TABLE}.id`)
        .innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.id`)
        .andWhere(`${ENROLLMENT_CLASS_TABLE}.classId`, data.classId);
}
