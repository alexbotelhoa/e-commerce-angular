export const concatArrayReducer: <T>(
    previousValue: T[],
    currentValue: T[]
) => T[] = (previousValue, currentValue) => {
    return previousValue.concat(currentValue);
};
