export interface SearchResultAccumulator<T> {
    found: T[];
    notFound: T[];
}

export type SearchResultFinder<T> = (currentValue: T) => boolean;

export const searchResultReducer = <T>(finder: SearchResultFinder<T>) => (accumulator: SearchResultAccumulator<T>, currentValue: T): SearchResultAccumulator<T> => {
    if (finder(currentValue)) {
        accumulator.found.push(currentValue);
    } else {
        accumulator.notFound.push(currentValue);
    }
    return accumulator;
}

export const searchResultReducerAccumulator: <T>() => SearchResultAccumulator<T> = () => ({
    found: [],
    notFound: [],
});
