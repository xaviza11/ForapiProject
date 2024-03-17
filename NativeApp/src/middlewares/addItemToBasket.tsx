import { LengthError} from '../com/errors/index';

/**
 * This logic adds one item to the user basket
 * @param retrieveBasket The id of the basket
 * @param secretPass Number for validating the client
 * @param retrieveToken The token of the user
 * @param data The data to add to the basket
 * @param language An object with the language
 * @param host The host of the API
 * @returns A Promise that resolves to the response data or rejects with an error
 */

export default function addItemToBasket(
  retrieveBasket: string,
  secretPass: number,
  retrieveToken: string,
  data: any,
  language: any,
  host: string
): Promise<any> {


  try {
    if (!retrieveToken.length) throw new LengthError(language.tokenEmpty);
    if (!retrieveBasket.length) throw new LengthError(language.idEmpty);
    if (!host.length) throw new LengthError(language.hostEmpty);
  } catch (error) {
    throw new LengthError(error.message);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
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

    const payload = { secretPass, retrieveBasket, data };

    const json = JSON.stringify(payload);

    xhr.open('POST', host + 'basket/addItem');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${retrieveToken}`);
    xhr.send(json);
  });
}
