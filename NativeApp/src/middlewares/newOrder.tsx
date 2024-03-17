import { LengthError} from '../com/errors/index';

/**
 * This logic sends the data for creating a new chat with the store.
 * @param {string} token The token of the user.
 * @param {string} storeId The id of the store.
 * @param {object} messages An object with the new message.
 * @param {array} item An array with the items.
 * @param {string} collection The collection of the item.
 * @param {string} host The host of the item.
 * @param {number} secretPass The secret pass for validating the client.
 * @param {object} language The language of the app.
 * @param {string} deadLine The deadline for the order.
 * @returns A Promise that resolves with data if successful or rejects with an error.
 */
export default function newOrder(token: string, storeId: string, messages: object, item: any[], collection: string, host: string, secretPass: number, language: any, deadLine: string): Promise<any> {

    try {
        if (!token.length) throw new LengthError(language.tokenEmpty);
        if (!storeId.length) throw new LengthError(language.idEmpty);
        if (!item.length) throw new LengthError(language.itemEmpty);
        if (!host.length) throw new LengthError(language.hostEmpty);
        if (!collection.length) throw new LengthError(language.collectionEmpty);
        if (!item.length) throw new LengthError(language.itemEmpty);
        if (!deadLine.length) throw new LengthError(language.deadLineEmpty);
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

        xhr.open('POST', `${host}newOrder`);

        const payload = {storeId, messages, item, secretPass, collection, deadLine };
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const json = JSON.stringify(payload);

        xhr.send(json);
    });
}
