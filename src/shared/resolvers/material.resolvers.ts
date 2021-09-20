

import { MaterialEntity } from "../../entities/material.entity";
import { GQLMaterialResolvers } from "../../resolvers-types";
import { getClassById } from "../repositories/class.repository";


export const studentMaterialFieldResolvers: Pick<GQLMaterialResolvers, keyof MaterialEntity> = {
    acquiredLanguageBooster: (obj) => obj.acquiredLanguageBooster,
    active: (obj) => obj.active,
    classId: (obj) => obj.classId,
    author: (obj) => obj.author,
    coverImg: (obj) => obj.coverImg,
    createdAt: (obj) => obj.createdAt,
    id: (obj) => obj.id,
    isInternal: (obj) => obj.isInternal,
    userId: (obj) => obj.userId,
    isbn: (obj) => obj.isbn,
    publisher: (obj) => obj.publisher,
    title: (obj) => obj.title,
    updatedAt: (obj) => obj.updatedAt,
}


export const studentMaterialResolver: GQLMaterialResolvers = {
    ...studentMaterialFieldResolvers,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    materialClass:  async (obj, params, context) =>  (await getClassById(context.readonlyDatabase)(obj.classId))!,
}