import { FormatError, LengthError } from '../com/errors/index';
import { IS_EMAIL_REGEX } from '../com/regex';

/**
 * This logic sends the data for updating a user's information.
 * @param token The user token.
 * @param password The current user password.
 * @param newEmail The new email for the user.
 * @param newPassword The new password for the user.
 * @param newName The new name for the user.
 * @param newPhone The new phone for the user.
 * @param language The language of the app.
 * @param host The host of the api.
 * @param secretPass The number to validate the client.
 * @returns A Promise that resolves with the updated data or rejects with an error.
 */
export default function updateUser(token: string, password: string, newEmail: string, newPassword: string, newName: string, newPhone: string, language: any, host: string, secretPass: number): Promise<any> {

    try {
        if (!IS_EMAIL_REGEX.test(newEmail)) throw new FormatError(language.emailNotValid)
        if (/\s/.test(newPassword) && newPassword !== 'none') throw new FormatError(language.passwordHasSpaces);
    } catch (error) {
        throw new FormatError(error.message);
    }

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

        xhr.onerror = () => reject(new Error(language.connectionError));

        xhr.open('PUT', `${host}account/update`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        const payload = {password, newEmail, newPassword, newName, newPhone, secretPass };
        const json = JSON.stringify(payload);

        xhr.send(json);
    });
}
