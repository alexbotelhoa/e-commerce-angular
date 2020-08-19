export interface ConsolidateEntitiesResult<O, N = O> {
    toDelete: O[];
    toUpdate: N[];
    toInsert: N[];
}

export type ConsolidateFinder<T> = (array: T[], entity: T) => boolean;

export const consolidateEntities = <O, N extends O = O>(finder: ConsolidateFinder<O>) =>
    (oldEntities: O[], newEntities: N[]): ConsolidateEntitiesResult<O, N> => {
        // to delete are old entities not found in new entities array
        const toDelete = oldEntities.filter(entity => !finder(newEntities, entity));
        // toUpdate are entities found in both arrays
        const toUpdate = newEntities.filter(entity => finder(oldEntities, entity));
        // to insert are new entities not present on old entities
        const toInsert = newEntities.filter(entity => !finder(oldEntities, entity));
        return {
            toDelete: toDelete,
            toUpdate: toUpdate,
            toInsert: toInsert,
        };
    }
