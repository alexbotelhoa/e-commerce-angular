import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectAnnotation } from "../../../shared/repositories/annotation.repository";
import { getOneOrNull } from "../../../shared/utils/get-one-or-null.util";

export const annotationQueryResolver: GQLQueryResolvers['Annotation'] = async (obj, params, context) => {
    if (context.currentUser?.id) {
        const userId = context.currentUser?.id;
        const meetingId = params.id;
        const annotation = getOneOrNull(await selectAnnotation(context.database).where("userId", "=", userId)
            .andWhere("meetingId", "=", meetingId))
        return annotation;
    } else {
        return null;
    }
}