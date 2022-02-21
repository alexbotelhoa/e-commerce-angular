import { GQLMaterialResolvers } from "../../resolvers-types";
import { getClassById } from "../repositories/class.repository";
import { MaterialEntity } from "../../entities/material.entity";

const materialEntityResolvers: Pick<GQLMaterialResolvers, keyof MaterialEntity> = {
    id: (obj) => obj.id,
    userId: (obj) => obj.userId,
    classId: (obj) => obj.classId,
    isbn: (obj) => obj.isbn,
    author: (obj) => obj.author,
    title: (obj) => obj.title,
    publisher: (obj) => obj.publisher,
    coverImg: (obj) => obj.coverImg,
    isInternal: (obj) => obj.isInternal,
    acquiredLanguageBooster: (obj) => obj.acquiredLanguageBooster,
    languageBank: (obj) => obj.languageBank ? true : false,
    active: (obj) => obj.active,
    contextId: (obj) => obj.contextId,
    createdAt: (obj) => obj.createdAt,
    updatedAt: (obj) => obj.updatedAt,
}

export const materialResolvers: GQLMaterialResolvers = {
    ...materialEntityResolvers,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    materialClass:  async (obj, params, context) =>  (await getClassById(context.readonlyDatabase)(obj.classId))!,
}
