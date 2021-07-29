export function getOneOrNull<T>(array: T[]): T | null {
    if (array.length > 0) {
        return array[0];
    }
    return null;
}
