import { IS_EMAIL_REGEX, HAS_SPACES_REGEX } from '../com/regex/index';
import { FormatError, LengthError } from '../com/errors/index';

/**
 * This logic sends the data to authenticate a user.
 * @param email The user email.
 * @param password The user password.
 * @param language An object containing language strings.
 * @param host The API host.
 * @param secretPass The secret password.
 * @returns A promise that resolves with the user token or rejects with an error.
 */
export default function authenticateUser(email: string, password: string, language: any, host: string, secretPass: number): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            if (!email.length) throw new LengthError(language.emailEmpty);
            if (password.length < 8) throw new LengthError(language.passwordLengthError);
            if (!host.length) throw new LengthError(language.hostEmpty);
        } catch (error) {
            reject(error);
            return;
        }

        try {
            if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(language.emailNotValid);
            if (HAS_SPACES_REGEX.test(password)) throw new FormatError(language.passwordHasSpaces);
        } catch (error) {
            reject(error);
            return;
        }

        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
            const { status, responseText: json } = xhr;

            if (status === 200) {
                const { token } = JSON.parse(json);
                resolve(token);
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

        xhr.open('POST', host + 'users/auth');
        xhr.setRequestHeader('Content-Type', 'application/json');

        const payload = { email, password, secretPass };

        const json = JSON.stringify(payload);

        xhr.send(json);
    });
}
