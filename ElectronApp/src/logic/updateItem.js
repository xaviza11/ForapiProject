const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for authenticate one user
 * @param {string} email The user email
 * @param {string} id The id of the item
 * @param {string} description The description of the item
 * @param {number} price The price of the item
 * @param {string} collection The collection of the item
 * @param {string} itemList The id of the itemList
 * @param {number} secretPass A password for validate client
 * @param {string} token The token of the user
 * @param {object} language One object whit the language
 * @param {string} host The host of the api
 * */

function updateItem(id, title, description, price, collection, itemList, secretPass, token, language, host) {

    try {
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof id !== 'string') throw new TypeError(language.idNotString)
        if (typeof title !== 'string')if(title !== undefined) throw new TypeError(language.titleNotString)
        if (typeof description !== 'string')if (description !== undefined) throw new TypeError(language.descriptionNotString)
        if (typeof price !== 'number') if (price !== undefined) throw new TypeError(language.priceNotNumber)
        if (typeof itemList !== 'string') throw new TypeError(language.itemNotString)
        if (typeof collection !== 'string') throw new TypeError(language.collectionNotString)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!host.length) throw new LengthError(language.hostEmpty)
        if (!token.length) throw new LengthError(language.tokenEmpty)
        if (!id.length) throw new LengthError(language.idEmpty)
        if (!itemList.length) throw new LengthError(language.itemEmpty)
        if (!collection.length) throw new LengthError(languge.collectionEmpty)
    } catch (error) { throw new LengthError(error) }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            const { status, responseText: json } = xhr

            if (status === 200) {
                const {token, name} = JSON.parse(json)
                resolve({token, name})
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


        xhr.open('PUT', host + 'item/updateItem')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = { id, title, description, price, collection, itemList, secretPass }

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = updateItem