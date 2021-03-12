import { GQLAnnotationResolvers } from "../../resolvers-types";
import { AnnotationEntity } from "../../entities/annotation.entity";

export const annotationEntityResolvers: Pick<GQLAnnotationResolvers, keyof AnnotationEntity> = {
    userId: (obj) => obj.userId,
    meetingId: (obj) => obj.meetingId,
    createdDate: (obj) => obj.createdDate,
    updatedDate: (obj) => obj.updatedDate,
    data: (obj) => obj.data,
    id: (obj) => obj.id,
}


export const annotationResolvers: GQLAnnotationResolvers = {
    ...annotationEntityResolvers,
}
