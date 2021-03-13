
import { format, } from "date-fns";
import { AnnotationEntity } from "../../../entities/annotation.entity";
import { GQLMutationResolvers } from "../../../resolvers-types";
import { getAnnotationById, insertAnnotation, selectAnnotation, updateAnnotation } from "../../../shared/repositories/annotation.repository";
import { getOneOrNull } from "../../../shared/utils/get-one-or-null.util";

export const upsertAnnotationResolver: GQLMutationResolvers['upsertAnnotation'] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) throw new Error("user not found")
    const annotation = getOneOrNull(await selectAnnotation(context.readonlyDatabase).where("meetingId", "=", params.annotation.meetingId)
        .andWhere("userId", "=", userId))
    if (annotation) {
        await updateAnnotation(context.database)({
            updatedDate: new Date().toISOString().replace('T', ' ').split('Z')[0],
            data: params.annotation.data,
        })(builder => builder.where("id", '=', annotation.id))
        return getAnnotationById(context.database)(annotation.id)
    } else {
        const partialData: Partial<AnnotationEntity> = {
            data: params.annotation.data,
            createdDate: new Date().toISOString().replace('T', ' ').split('Z')[0],
            meetingId: params.annotation.meetingId,
            updatedDate: new Date().toISOString().replace('T', ' ').split('Z')[0],
            userId: userId,
        }
        const entityId = await insertAnnotation(context.database)(partialData)
        return getAnnotationById(context.database)(entityId)
    }
}