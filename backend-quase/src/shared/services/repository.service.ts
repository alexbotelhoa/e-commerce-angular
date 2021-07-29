import { DatabaseService } from "./database.service";
import Knex from "knex";
import { StringKeyof } from "../types/string-keyof.type";
import { getOneOrNull } from "../utils/get-one-or-null.util";

export const getEntityById =
    <T, IdType extends string | number = string | number>(table: string) =>
        (idKey: StringKeyof<T>) =>
            (db: DatabaseService<T, T>) =>
                (id: IdType): Promise<T | null> => {
                    return db.table(table)
                        .select('*')
                        .where(idKey, id)
                        .then(getOneOrNull) as Promise<T | null>
                }

export const insertEntity =
    <T>(table: string) =>
        (db: DatabaseService) =>
            (data: Partial<T> | Array<Partial<T>>): Promise<number[]> => db.table(table).insert(data);

export const updateEntity =
    <T>(table: string) =>
        (db: DatabaseService<T, T>) =>
            (data: Partial<T>) =>
                (where: Knex.QueryCallback<T, T>): Promise<any> => db.table(table).update(data).where(where);

export const deleteEntity =
    <T>(table: string) =>
        (db: DatabaseService<T, T>) =>
            (where: Knex.QueryCallback<T, T>): Promise<any> =>
                db.table(table).del().where(where);

export const deleteAllEntities =
    <T>(table: string) =>
        (db: DatabaseService<T, T>): Promise<any> =>
            db.table(table).del();

export const selectEntity =
    <T>(table: string) =>
        (db: DatabaseService<T, T>) =>
            async (where: Knex.QueryCallback<T, T>): Promise<T[]> =>
                db.table(table).select('*').where(where);

export const createRepository = <T, IdType extends string | number = string | number>(table: string, idKey: StringKeyof<T>) => {
    return {
        getById: getEntityById<T, IdType>(table)(idKey),
        select: selectEntity<T>(table),
        insert: insertEntity<T>(table),
        update: updateEntity<T>(table),
        delete: deleteEntity<T>(table),
        deleteAll: deleteAllEntities<T>(table),
    }
}
