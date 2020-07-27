import { StringKeyof } from "../types/string-keyof.type";

/**
 * Utility function to sort and normalize the results of a dataloader batch query that loads many entities for a key
 * @param idKey The key that represents the id of the entity used by the dataloader to load the entities
 */
export const createDataloaderMultiSort = <T, IdKeyType extends string | number>(
    idKey: StringKeyof<T>) =>
    (ids: ReadonlyArray<IdKeyType>) => (result: T[]): Array<T[]> => {
        const entitiesById = result.reduce<Record<IdKeyType, T[]>>(groupEntitiesById<T, IdKeyType>(idKey), {} as Record<IdKeyType, T[]>);
        // map to each array, and fallback to an empty array if no array is found in the map
        return ids.map((id) => entitiesById[id] || []);
    }

/**
 * Reducer function factory to accumulate entities in a map object grouped by the idKey
 * @param idKey The key that represents the id of the entity used by the dataloader to load the entities
 */
export function groupEntitiesById<T, IdKeyType extends string | number>(idKey: Extract<keyof T, string>):
    (previousValue: Record<IdKeyType, T[]>, currentValue: T) => Record<IdKeyType, T[]> {
    return (map, entity) => {
        // get or create the array that will hold the entities for the id
        const array: T[] = map[entity[idKey] as unknown as IdKeyType] || [];
        // push the entity into the array to group it with others of the same id
        array.push(entity);
        return map;
    };
}

