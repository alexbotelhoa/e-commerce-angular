export function getOneOrNull<T>(array: T[]): T | null {
    if(array.length > 0) {
        return array[0];
    }
    return null;
}

/**
 * Unsafe getOne function, fails if array is empty. Use only with garanteed non-empty arrays
 * @param array 
 */
export function getOneOrFail<T>(array: T[]): T {
    if(array.length > 0) {
        return array[0];
    }
    throw new Error('Unable to get first result from array');
}
