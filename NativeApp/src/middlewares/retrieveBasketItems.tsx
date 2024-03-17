import { LengthError } from '../com/errors/index';

/**
 * This logic sends the data for retrieving the furniture inside the basket.
 * @param id The id of the search for finding it in the database
 * @param token The token of the user
 * @param secretPass The pass for validating the client
 * @param language The language of the app
 * @param host The host of the app
 * @returns A Promise that resolves to the response data or rejects with an error
 */
export default function retrieveBasketItems(id: string, token: string, secretPass: number, language: any, host: string): Promise<any> {
  try {
    if (!token.length) throw new LengthError(language.tokenEmpty);
    if (!id.length) throw new LengthError(language.idEmpty);
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

    xhr.open('POST', `${host}basket/retrieve`);

    const payload = { id, secretPass };
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const json = JSON.stringify(payload);

    xhr.send(json);
  });
}
