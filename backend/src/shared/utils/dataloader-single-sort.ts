import { StringKeyof } from "../types/string-keyof.type";

export const createDataloaderSingleSort = <T, IdKeyType extends string | number, ResultType extends T | undefined = T | undefined>(
    idKey: StringKeyof<T>) =>
    (ids: ReadonlyArray<IdKeyType>) => (result: T[]): Array<ResultType> => {
        const entitiesById = result.reduce<Record<IdKeyType, ResultType>>((map, entity) => {
            map[entity[idKey] as unknown as IdKeyType] = entity as ResultType;
            return map;
        }, {} as any);
        return ids.map((id) => entitiesById[id]);
    }
