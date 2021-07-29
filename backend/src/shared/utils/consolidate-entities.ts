export interface ConsolidateEntitiesResult<O, N = O> {
    toDelete: O[];
    toUpdate: N[];
    toInsert: N[];
}

export type ConsolidateFinder<T> = (array: T[], entity: T) => boolean;

export const consolidateEntities = <O, N extends O = O>(finder: ConsolidateFinder<O>) =>
    (oldEntities: O[], newEntities: N[]): ConsolidateEntitiesResult<O, N> => {
        const toDelete = oldEntities.filter(entity => !finder(newEntities, entity));
        const toUpdate = newEntities.filter(entity => finder(oldEntities, entity));
        const toInsert = newEntities.filter(entity => !finder(oldEntities, entity));
        return {
            toDelete: toDelete,
            toUpdate: toUpdate,
            toInsert: toInsert,
        };
    }
