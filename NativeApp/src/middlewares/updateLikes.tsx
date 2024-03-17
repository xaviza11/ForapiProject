import { LengthError} from '../com/errors/index';

/**
 * This logic sends the data to update the likes of the user.
 * @param token The user token.
 * @param furnitureId The id of the furniture.
 * @param index The index to like or dislike.
 * @param language The language of the app.
 * @param host The host of the api.
 * @param secretPass The pass for validating the client.
 * @param collection The collection of the item.
 * @returns A Promise that resolves with the updated data or rejects with an error.
 */
export default function updateLikes(token: string, furnitureId: string, index: number, language: any, host: string, secretPass: number, collection: string): Promise<any> {
        
    try {
        if (!furnitureId.length) throw new LengthError(language.idEmpty);
        if (!collection.length) throw new LengthError(language.collectionEmpty);
        if (!token.length) throw new LengthError(language.tokenEmpty);
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

        const payload = {furnitureId, index, secretPass, collection };
        const json = JSON.stringify(payload);

        xhr.open('PUT', `${host}updateLikes`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(json);
    });
}
