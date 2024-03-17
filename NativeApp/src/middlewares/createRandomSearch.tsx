import { LengthError} from '../com/errors/index';

/**
 * This logic sends the data for creating a new search of furniture.
 * @param {string} token The token of the user.
 * @param {number} lat The latitude.
 * @param {number} lon The longitude.
 * @param {string} host The host of the API.
 * @param {object} language The language of the app.
 * @param {number} secretPass The secret pass for validating the client.
 */

export default function createRandomSearch(token: string | null, lat: string, lon: string, language: {[key: string]: string}, host: string, secretPass: number): Promise<any> {

    const latValue = parseFloat(lat);
    const lonValue = parseFloat(lon);

    try {
        if(token )if (!token.length) throw new LengthError(language.tokenEmpty);
        if (!host.length) throw new LengthError(language.hostEmpty);
    } catch (error) {
        throw new LengthError(error.message);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
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

        xhr.onerror = () => reject(new Error(language.connectionError));

        xhr.open('POST', host + 'createRandomSearch');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const payload = {lat: latValue, lon: lonValue, secretPass };

        const jsonString = JSON.stringify(payload);

        xhr.send(jsonString);
    });
}
