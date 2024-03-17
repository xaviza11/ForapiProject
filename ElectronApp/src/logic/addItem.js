const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for authenticate one user
 * @param {number} price The price of the user
 * @param {string} title The title of the item
 * @param {string} description The description of the item
 * @param {Array} props Array whit the props of the item
 * @param {Array} images Array whit the links of the images
 * @param {Array} inventories Array of inventories of the item
 * @param {string} soldBy The id of the store
 * @param {string} collection The collection inside the api
 * @param {string} rangePrice The rangePrice of the item
 * @param {string} reference The reference of the item
 * @param {number} secretPass A pass for validate the request
 * @param {object} language The language of the app
 * @param {string} host The host of the api
 * @param {string} token The token
 * */

function addItem(price, title, description, props, images, inventories, soldBy, collection, reference, secretPass, language, host, token, currency) {

    console.log(price, title, description, props, images, inventories, soldBy, collection, reference, secretPass, language, host, token, currency)

    try {
        if (typeof secretPass !== 'number') throw new TypeError(language.passwordNotNumber)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof price !== 'string') throw new TypeError(language.priceNotValid)
        if (typeof title !== 'string') throw new TypeError(language.titleNotString)
        if (typeof description !== 'string') throw new TypeError(language.descriptionNotString)
        if (typeof soldBy !== 'string') throw new TypeError(language.idNotString)
        if (typeof collection !== 'string') throw new TypeError(language.collectionNotString)
        if (typeof reference !== 'string') throw new TypeError(language.referenceEmpty)
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
        if (typeof currency !== 'string') throw new TypeError(language.currency)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!host.length) throw new LengthError(language.hostEmpty)
        if (!token.length) throw new LengthError(language.tokenEmpty)
        if (!title.length) throw new LengthError(language.titleEmpty)
        if (!description.length) throw new LengthError(language.descriptionEmpty)
        if (!soldBy.length) throw new LengthError(language.idEmpty)
        if (!collection.length) throw new LengthError(language.collectionEmpty)
        if (!reference.length) throw new LengthError(language.referenceEmpty) 
    } catch (error) { throw new LengthError(error) }

    console.log(images)

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            const { status, responseText: json } = xhr

            if (status === 200) {
                const { token } = JSON.parse(json)
                resolve(token)
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


        xhr.open('POST', host + 'addFurniture')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = { price, title, description, props, images, inventories, soldBy, collection, reference, secretPass, currency }

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = addItem