import { StringKeyof } from "../types/string-keyof.type";
import { CountObj } from "../types/count-obj.type";

/**
 * Utility function to sort and normalize the results of a dataloader batch count query that loads returns the count for a key
 * @param idKey The key that represents the id of the entity used by the dataloader to group the count results
 */
export const createDataloaderCountSort = <T extends CountObj, IdKeyType extends string | number>(
    idKey: StringKeyof<T>) =>
    (ids: ReadonlyArray<IdKeyType>) => (result: T[]): Array<number> => {
        const entitiesById = result.reduce<Record<IdKeyType, CountObj | undefined>>((map, entity) => {
            // TODO remove forced casting
            map[entity[idKey] as unknown as IdKeyType] = entity;
            return map;
        }, {} as any);
        return ids.map((id) => {
            const entity = entitiesById[id];
            if (entity) {
                return entity["count(*)"];
            }
            return 0;
        });
    }
