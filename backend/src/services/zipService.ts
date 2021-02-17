import * as zlib from "zlib";

export const compress = (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        zlib.gzip(text, (error, zipped) => {
            if (error) {
                reject(error);
            } else {
                resolve(zipped.toString("base64"));
            }
        });
    });
}