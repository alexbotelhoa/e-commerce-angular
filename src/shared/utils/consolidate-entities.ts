export interface ConsolidateEntitiesResult<T> {
    toDelete: T[];
    toUpdate: T[];
    toInsert: T[];
}

export type ConsolidateFinder<T> = (array: T[], entity: T) => boolean;

export const consolidateEntities = <T>(finder: ConsolidateFinder<T>) => (oldEntities: T[], newEntities: T[]): ConsolidateEntitiesResult<T> => {
    // to delete are old entities not found in new entities array
    const toDelete = oldEntities.filter(entity => !finder(newEntities, entity));
    // toUpdate are entities found in both arrays
    const toUpdate = oldEntities.filter(entity => finder(newEntities, entity));
    // to insert are new entities not present on old entities
    const toInsert = newEntities.filter(entity => !finder(oldEntities, entity));
    return {
        toDelete: toDelete,
        toUpdate: toUpdate,
        toInsert: toInsert,
    };
}
