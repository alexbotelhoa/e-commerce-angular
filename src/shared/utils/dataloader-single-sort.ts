import { StringKeyof } from "../types/string-keyof.type";

/**
 * Utility function to sort and normalize the results of a dataloader batch query that loads up to a single entity for a key
 * @param idKey The key that represents the id of the entity used by the dataloader to load the entities
 */
export const createDataloaderSingleSort = <T, IdKeyType extends string | number, ResultType extends T | undefined = T | undefined>(
    idKey: StringKeyof<T>) =>
    (ids: ReadonlyArray<IdKeyType>) => (result: T[]): Array<ResultType> => {
        const entitiesById = result.reduce<Record<IdKeyType, ResultType>>((map, entity) => {
            // TODO remove forced casting
            map[entity[idKey] as unknown as IdKeyType] = entity as ResultType;
            return map;
        }, {} as any);
        return ids.map((id) => entitiesById[id]);
    }
