import { GQLQueryResolvers } from "../../resolvers-types";
import { selectEnrollment } from "../../shared/repositories/enrollment.repository";

export const myEnrollmentsQueryResolver: GQLQueryResolvers['myEnrollments'] = (obj, params, context) => {
    const currentUser = context.currentUser;
    if (!currentUser) {
        return [];
    }
    const enrollments = selectEnrollment(context.database).andWhere('userId', currentUser.id);
    return enrollments;
}
