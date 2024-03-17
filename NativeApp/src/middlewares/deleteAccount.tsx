import { LengthError} from '../com/errors/index';

/**
 * This logic sends the email and password of the user to delete the current account
 * @param token The token
 * @param password The current password for deleting the account
 * @param language The language of the app
 * @param host The host of the API
 * @param secretPass The pass for validating the client
 * @returns A Promise that resolves to the response data or rejects with an error
 */
export default function deleteAccount(token: string, password: string, language: any, host: string, secretPass: number): Promise<any> {

  try {
    if (!token.length) throw new LengthError(language.tokenEmpty);
    if (!password.length) throw new LengthError(language.passwordEmpty);
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

    xhr.open('DELETE', `${host}account/delete`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const payload = {password, secretPass };

    const json = JSON.stringify(payload);

    xhr.send(json);
  });
}
