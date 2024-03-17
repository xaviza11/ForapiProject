const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for authenticate one user
 * @param {string} itemId The id of the item
 * @param {string} collection The collection of the item
 * @param {number} secretPass The number for validate the client
 * @param {object} language The language of the app
 * @param {string} host The host of the api
 * @param {string} token The token of the user
 * */

function addItem(itemId, collection, secretPass, language, host, token) {

    try {
        if (typeof secretPass !== 'number') throw new TypeError(language.secreNotNumebr)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof itemId !== 'string') throw new TypeError(language.idNotString)
        if (typeof collection !== 'string') throw new TypeError(language.collectionNotString)
        if (typeof language !== 'object') throw new TypeError(language.languageNotObject)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!host.length) throw new LengthError(language.hostEmpty)
        if (!token.length) throw new LengthError(language.tokenEmpty)
        if (!collection.length) throw new LengthError(language.collectionEmpty)
        if (!itemId.length) throw new LengthError(language.idEmpty)
    } catch (error) { throw new LengthError(error) }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            const { status, responseText: json } = xhr

            if (status === 200) {
                const { token, item } = JSON.parse(json)
                resolve({token, item})
            } else if (status === 400) {
                const { error } = JSON.parse(json)
                if (error.includes('type'))
                    alert(error)
                else if (error.includes('format'))
                    alert(error)
                else if (error.includes('length'))
                    alert(error)
            } else if (status === 401) {
                const { error } = JSON.parse(json)
                alert(error)
            } else if (status === 404) {
                const { error } = JSON.parse(json)
                alert(error)
            } else if (status < 500) {
                const { error } = JSON.parse(json)
                alert(error)
            } else {
                const { error } = JSON.parse(json)
                alert(error)
            }

        }

        xhr.onerror = () => reject(new Error(language.connectionError))


        xhr.open('POST', host + 'items/retrieveOneItem')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = { itemId, collection, secretPass}

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = addItem