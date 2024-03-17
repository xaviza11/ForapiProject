import { LengthError } from '../com/errors/index';

/**
 * This logic sends the data to update the profile image of the user.
 * @param url The URL of the image to update.
 * @param storeId The id of the store.
 * @param secretPass The pass for validating the client.
 * @param token The user token.
 * @param host The host of the api.
 * @param language The language of the app.
 * @returns A Promise that resolves with the updated data or rejects with an error.
 */
export default function updateProfileImage(url: string, storeId: string, secretPass: number, token: string, host: string, language: any): Promise<any> {

    try {
        if (!url.length) throw new LengthError(language.urlEmpty);
        if (!storeId.length) throw new LengthError(language.storeIdEmpty);
        if (!token.length) throw new LengthError(language.tokenEmpty);
        if (!host.length) throw new LengthError(language.hostEmpty);
    } catch (error) {
        throw new LengthError(error.message);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            const { status, responseText: json } = xhr;
            if (status === 200) {
                const data = JSON.parse(json)
                resolve(data)
            } else if (status === 400) {
                const { error } = JSON.parse(json);
                reject(error)
            } else if (status === 401) {
                const { error } = JSON.parse(json);
                reject(error)
            } else if (status === 404) {
                const { error } = JSON.parse(json);
                reject(error)
            } else if (status < 500) {
                const { error } = JSON.parse(json);
                reject(error)
            } else {
                const { error } = JSON.parse(json);
                reject(error)
            }
        };

        const payload = { url, storeId, secretPass};
        const json = JSON.stringify(payload);

        xhr.open('POST', `${host}uploadProfileImage`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(json);
    });
}
