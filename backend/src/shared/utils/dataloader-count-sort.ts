import { CountObj } from "../types/count-obj.type";
import { StringKeyof } from "../types/string-keyof.type";

export const createDataloaderCountSort = <T extends CountObj, IdKeyType extends string | number>(
    idKey: StringKeyof<T>) =>
    (ids: ReadonlyArray<IdKeyType>) => (result: T[]): Array<number> => {
        const entitiesById = result.reduce<Record<IdKeyType, CountObj | undefined>>((map, entity) => {
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
