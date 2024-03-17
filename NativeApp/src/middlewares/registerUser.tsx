import {  IS_EMAIL_REGEX, HAS_SPACES_REGEX } from '../com/regex/index';
import { FormatError, LengthError} from '../com/errors/index';

/**
 * This logic sends the data for create a new user
 * @param {string} name The user name 
 * @param {string} email The user email
 * @param {string} password The user password
 * @param {string} repeatPassword The validate of the password
 * @param {string} storeCode The store code for create store
 * @param {string} phone The phone number
 * @param {string} host The host of the app
 * @param {number} secretPass The secretPass of the app
 * @param {object} language The language of the app 
 * */

export default function registerUser(name: string, email: string, password: string, repeatPassword: string, storeCode: string, phone: string, host: string, secretPass: number, language: any) {

    if (password !== repeatPassword) throw new Error((language).passwordsNotMatch);

    if (!storeCode) storeCode = 'none';

    try {
        if (!email.length) throw new LengthError((language).emailEmpty);
        if (name.length < 1) throw new LengthError((language).nameLength);
        if (password.length < 8) throw new LengthError((language).passwordLength);
        if (!phone.length) throw new LengthError((language).phoneEmpty);
        if (!host.length) throw new LengthError((language).hostEmpty);
    } catch (error) { throw new LengthError(error.message); }

    try {
        if (!IS_EMAIL_REGEX.test(email)) throw new FormatError((language).emailNotString);
        if (HAS_SPACES_REGEX.test(password)) throw new FormatError((language).passwordHasSpaces);
    } catch (error: any) { throw new FormatError(error.message); }

    return new Promise<void>((resolve, reject) => {
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

        xhr.onerror = () => reject(new Error('connection error'));

        xhr.open('POST', host + 'users/register');
        xhr.setRequestHeader('Content-Type', 'application/json');

        const payload = { name, email, password, storeCode, phone, secretPass };

        const json = JSON.stringify(payload);

        xhr.send(json);
    });
}
