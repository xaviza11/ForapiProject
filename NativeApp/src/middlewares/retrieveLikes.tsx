import { LengthError} from '../com/errors/index';

/**
 * This logic sends the data for retrieving the furnitureData inside likes data.
 * @param token The user token
 * @param language The language of the app
 * @param host The host of the api
 * @param secretPass The pass for validating the client 
 * @returns A Promise that resolves to the retrieved furniture data or rejects with an error
 */
export default function retrieveLikes(token: string, language: any, host: string, secretPass: number): Promise<any> {
    try {
        if (!token.length) throw new LengthError(language.tokenEmpty);
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

        xhr.open('POST', `${host}likes`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        const payload = {secretPass };
        const json = JSON.stringify(payload);

        xhr.send(json);
    });
}
