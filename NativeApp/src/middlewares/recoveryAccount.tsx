import { IS_EMAIL_REGEX } from '../com/regex/index';
import { FormatError, LengthError} from '../com/errors/index';

export default function recoveryAccount(email: string, host: string, secretPass: number, language: any) {

    try {
        if (!email.length) throw new LengthError(language.emailEmpty);
        if (!host.length) throw new LengthError(language.hostEmpty);
    } catch (error) {
        throw new LengthError(error.message);
    }

    try {
        if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(language.emailEmpty);
    } catch (error) {
        throw new FormatError(error.message);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
            const { status, responseText: json } = xhr;
            if (status === 200) {
                resolve('');
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

        const payload = { email, secretPass };

        const json = JSON.stringify(payload);

        xhr.send(json);
    });
}
