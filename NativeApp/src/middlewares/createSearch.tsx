import { LengthError} from '../com/errors/index';

/**
 * This logic sends the data to create a new search of furniture
 * @param email The email of the user
 * @param token The token of the user
 * @param index The index of the search
 * @param lat The latitude
 * @param lon The longitude
 * @param slider The area of the search
 * @param acc The accuracy of the search
 * @param language The language of the app
 * @param host The host of the api
 * @param collection The collection of the item
 * @param secretPass The secretPass for validating the client
 * @returns A Promise that resolves to the response data or rejects with an error
 */
export default function createSearch(
  token: string,
  tagsSearchValue: string,
  index: number,
  lat: string,
  lon: string,
  slider: string,
  acc: string,
  language: any,
  host: string,
  collection: string,
  secretPass: number
): Promise<any> {
  const latValue = parseFloat(lat);
  const lonValue = parseFloat(lon);
  const sliderValue = parseInt(slider);
  const accValue = parseFloat(acc);

  try {
    if (!token.length) throw new LengthError(language.tokenEmpty);
    if (!tagsSearchValue.length) throw new LengthError(language.tagsEmpty);
    if (!host.length) throw new LengthError(language.hostEmpty);
    if (!collection.length) throw new LengthError(language.collectionEmpty);
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

    xhr.open('POST', host + 'search/create');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const payload = {tagsSearchValue, index, latValue, lonValue, sliderValue, accValue, collection, secretPass };

    const json = JSON.stringify(payload);

    xhr.send(json);
  });
}
