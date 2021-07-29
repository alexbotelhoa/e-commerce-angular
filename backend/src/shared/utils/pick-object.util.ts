export const pickObject = <T, K extends keyof T>(keys: K[]) => (object: T): Pick<T, K> => {
    const newObject: Partial<T> = {};
    keys.forEach(key => {
        newObject[key] = object[key];
    });
    return newObject as Pick<T, K>;
}
