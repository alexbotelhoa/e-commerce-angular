import { DatabaseService } from "./database.service";
import Knex from "knex";
import { StringKeyof } from "../types/string-keyof.type";
import { getOneOrNull, getOneOrFail } from "../utils/get-one-or-null.util";

export const getEntityById =
    <T, IdType extends string | number = string | number>(table: string) =>
        (idKey: StringKeyof<T>) =>
            (db: DatabaseService<T, T[]>) =>
                (id: IdType): Promise<T | null> => {
                    return db.table(table)
                        .select('*')
                        .where(idKey, id)
                        .then(getOneOrNull);
                }

export const getEntitiesByIds =
    <T, IdType extends string | number = string | number>(table: string) =>
        (idKey: StringKeyof<T>) =>
            (db: DatabaseService<T, T[]>) =>
                (ids: IdType[]): Knex.QueryBuilder<T, T[]> => {
                    return db
                        .select('*')
                        .from<T, T[]>(table)
                        .whereIn(idKey, ids)
                }

export const insertEntity =
    <T>(table: string) =>
        (db: DatabaseService) =>
            (data: Partial<T> | Array<Partial<T>>): Promise<number> => db.insert(data).into(table).then(getOneOrFail);

export const updateEntity =
    <T>(table: string) =>
        (db: DatabaseService<T, number>) =>
            (data: Partial<T>) =>
                (where: Knex.QueryCallback<T, number>) =>
                    db.table(table).update(data).where(where);

export const deleteEntity =
    <T>(table: string) =>
        (db: DatabaseService<T, number>) =>
            (where: Knex.QueryCallback<T, number>) =>
                db.table<T, number>(table).del().where(where);

export const deleteAllEntities =
    <T>(table: string) =>
        (db: DatabaseService<T, T[]>): Knex.QueryBuilder<T, T[]> =>
            db.table(table).del();

export const selectEntity =
    <T>(table: string) =>
        (db: DatabaseService<T, T[]>): Knex.QueryBuilder<T, T[]> =>
            db.select('*').from<T, T[]>(table);

export const createRepository = <T, IdType extends string | number = string | number>(table: string, primaryColumn: StringKeyof<T>) => {
    return {
        getById: getEntityById<T, IdType>(table)(primaryColumn),
        getManyByIds: getEntitiesByIds<T, IdType>(table)(primaryColumn),
        select: selectEntity<T>(table),
        insert: insertEntity<T>(table),
        update: updateEntity<T>(table),
        delete: deleteEntity<T>(table),
        deleteAll: deleteAllEntities<T>(table),
    }
}
