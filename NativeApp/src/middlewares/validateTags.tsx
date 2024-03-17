import { LengthError} from '../com/errors/index';

/**
 * This logic sends the data for validating if tags exist, and adds data or creates new if they don't exist.
 * @param token The user token.
 * @param tagsSearchValue The search data.
 * @param location Object of latitude, longitude, and accuracy.
 * @param language The language of the app.
 * @param host The host of the app.
 * @param secretPass The pass to validate the client.
 * @returns A Promise that resolves with no data if successful or rejects with an error.
 */
export default function validateTags(token: string, tagsSearchValue: string, location: string | object, language: any, host: string, secretPass: number): Promise<void> {

    try {
        if (!token.length) throw new LengthError(language.tokenEmpty);
        if (!tagsSearchValue.length) throw new LengthError(language.emptyData);
        if (!host.length) throw new LengthError(language.hostEmpty);
    } catch (error) {
        throw new LengthError(error.message);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
            const { status, responseText: json } = xhr;
            if (status === 200) {
                resolve()
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

        xhr.onerror = () => reject(new Error(language.connectionError));

        xhr.open('POST', `${host}tags`);

        const payload = {tagsSearchValue, location, secretPass};
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const json = JSON.stringify(payload);

        xhr.send(json);
    });
}
