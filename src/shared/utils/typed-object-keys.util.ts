/**
 * Typed version of Object.keys. Use with caution, 
 * because at runtime you can't garantee an object won't have additional properties attached to it, 
 * thus invalidating the return type.
 * @param object 
 */
export const objectKeys: <T>(object: T) => Array<keyof T> = Object.keys as any;
