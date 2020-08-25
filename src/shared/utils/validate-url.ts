export const validateURL = (url: string): boolean => {
    try {
        const objURL = new URL(url);

        if (!objURL.protocol.includes('https')) {
            throw new Error('Wrong protocol!')
        }
    } catch {
        return false;
    }

    return true;
}