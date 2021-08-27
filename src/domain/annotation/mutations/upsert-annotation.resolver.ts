
import { format, } from "date-fns";
import { AnnotationEntity } from "../../../entities/annotation.entity";
import { GQLMutationResolvers, GQLMutationupsertAnnotationArgs, RequireFields } from "../../../resolvers-types";
import { getAnnotationById, insertAnnotation, selectAnnotation, updateAnnotation } from "../../../shared/repositories/annotation.repository";
import { GraphQLContext } from "../../../shared/types/context.type";
import { getOneOrNull } from "../../../shared/utils/get-one-or-null.util";

export const upsertAnnotationResolver: GQLMutationResolvers['upsertAnnotation'] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) throw new Error("user not found");
    if (params.annotation.id) {
        const annotation = await getAnnotationById(context.readonlyDatabase)(params.annotation.id)
        if (annotation) {
            return await updateAnnotationFun(context, params, annotation);
        } else {
            return await createAnnotationFun(params, userId, context);
        }
    }
    if (params.annotation.meetingId) {
        const annotation = getOneOrNull(await selectAnnotation(context.readonlyDatabase).where("meetingId", "=", params.annotation.meetingId)
            .andWhere("userId", "=", userId))
        if (annotation) {
            return await updateAnnotationFun(context, params, annotation);
        } else {
            return await createAnnotationFun(params, userId, context);
        }
    }
    return await createAnnotationFun(params, userId, context);
}

async function createAnnotationFun(params: RequireFields<GQLMutationupsertAnnotationArgs, "annotation">, userId: string, context: GraphQLContext) {
    const partialData: Partial<AnnotationEntity> = {
        data: params.annotation.data,
        createdDate: new Date().toLocaleString("pt-BR"),
        meetingId: params.annotation.meetingId || undefined,
        updatedDate: new Date().toLocaleString("pt-BR"),
        userId: userId,
    };
    const entityId = await insertAnnotation(context.database)(partialData);
    return getAnnotationById(context.database)(entityId);
}

async function updateAnnotationFun(context: GraphQLContext, params: RequireFields<GQLMutationupsertAnnotationArgs, "annotation">, annotation: AnnotationEntity) {
    await updateAnnotation(context.database)({
        updatedDate: new Date().toLocaleString("pt-BR"),
        data: params.annotation.data,
    })(builder => builder.where("id", '=', annotation.id));
    return getAnnotationById(context.database)(annotation.id);
}
