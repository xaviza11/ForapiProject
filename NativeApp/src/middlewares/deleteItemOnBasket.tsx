import { LengthError} from '../com/errors/index';

/**
 * This logic sends the data for deleting one item from the basket
 * @param id The id of the basket
 * @param index The position in the array of the index
 * @param secretPass The secretPass for validating the client
 * @param token The token of the user
 * @param host The host of the API
 * @param language An object with the language
 * @returns A Promise that resolves to the response data or rejects with an error
 */
export default function deleteItemOnBasket(id: string, index: number, secretPass: number, token: string, host: string, language: any): Promise<any> {

  try {
    if (!id.length) throw new LengthError(language.idEmpty);
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

    xhr.open('DELETE', `${host}basket/deleteItem`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const payload = { id, index, secretPass};

    const json = JSON.stringify(payload);

    xhr.send(json);
  });
}
