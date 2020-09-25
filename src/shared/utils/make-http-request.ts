import https from 'https';

export const makeRequest = (url: string): Promise<string> => new Promise((resolve, reject) => https.get(url, res => {
    let data = '';

    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));

}).on("error", err => reject(err.message)));
