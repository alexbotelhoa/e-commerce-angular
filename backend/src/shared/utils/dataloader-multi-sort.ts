import { StringKeyof } from "../types/string-keyof.type";

export const createDataloaderMultiSort = <T, IdKeyType extends string | number>(
    idKey: StringKeyof<T>) =>
    (ids: ReadonlyArray<IdKeyType>) => (result: T[]): Array<T[]> => {
        const entitiesById = result.reduce<Record<IdKeyType, T[]>>(groupEntitiesById<T, IdKeyType>(idKey), {} as Record<IdKeyType, T[]>);
        return ids.map((id) => entitiesById[id] || []);
    }

export function groupEntitiesById<T, IdKeyType extends string | number>(idKey: Extract<keyof T, string>):
    (previousValue: Record<IdKeyType, T[]>, currentValue: T) => Record<IdKeyType, T[]> {
    return (map, entity) => {
        const array: T[] = map[entity[idKey] as unknown as IdKeyType] || [];
        map[entity[idKey] as unknown as IdKeyType] = array;
        array.push(entity);
        return map;
    };
}
