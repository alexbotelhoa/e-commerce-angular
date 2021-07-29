export function getOneOrNull<T>(array: T[]): T | null {
    if(array.length > 0) {
        return array[0];
    }
    return null;
}

export function getOneOrFail<T>(array: T[]): T {
    if(array.length > 0) {
        return array[0];
    }
    throw new Error('Unable to get first result from array');
}
