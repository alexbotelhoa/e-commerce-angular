import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectAnnotation } from "../../../shared/repositories/annotation.repository";

export const annotationsQueryResolver: GQLQueryResolvers['Annotations'] = async (obj, params, context) => {
    if (context.currentUser?.id) {
        const userId = context.currentUser?.id;

        const annotationQuery = selectAnnotation(context.database).where("userId", "=", userId);
        if (params.annotationId) {
            annotationQuery.andWhere("id", "=", params.annotationId)
            return await annotationQuery;
        }
        if (params.search) {
            annotationQuery.andWhere("data", "like", `%${params.search}%`)
        }
        if (params.date) {
            annotationQuery.andWhere("createdDate", "=", params.date)
        }
        return await annotationQuery;
    } else {
        return [];
    }
}