import { LengthError} from '../com/errors/index'

/**
 * This logic sends the data to retrieve a user.
 * @param {string | null} token The user token.
 * @param {object} language An object containing language translations.
 * @param {string} host The API host.
 * @param {number} secretPass The secret pass to validate the client.
 */
export default function retrieveUser(token: string | null, language: any, host: string, secretPass: number): Promise<any> {
    
    try {
       if(token)  if (!token.length) throw new LengthError(language.tokenEmpty);
        if (!host.length) throw new LengthError(language.hostEmpty);
    } catch (error) {
        throw new LengthError(error.message);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            const { status, responseText: json } = xhr;
            if (status === 200) {
                const result = JSON.parse(json)
                resolve(result)
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

        xhr.open('POST', host + 'users');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        const payload = {secretPass };

        const json = JSON.stringify(payload);

        xhr.send(json);
    });
}
