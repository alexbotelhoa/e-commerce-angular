import { GQLAnnotationResolvers } from "../../resolvers-types";
import { AnnotationEntity } from "../../entities/annotation.entity";

export const annotationEntityResolvers: Pick<GQLAnnotationResolvers, keyof AnnotationEntity> = {
    userId: (obj) => obj.userId,
    meetingId: (obj) => obj.meetingId,
    createdDate: (obj) => new Date(obj.createdDate).toISOString(), //("pt-BR", {timeZone: "America/Sao_Paulo"}),
    updatedDate: (obj) => new Date(obj.updatedDate).toISOString(), //("pt-BR", {timeZone: "America/Sao_Paulo"}),
    data: (obj) => obj.data,
    id: (obj) => obj.id,
}


export const annotationResolvers: GQLAnnotationResolvers = {
    ...annotationEntityResolvers,
}
