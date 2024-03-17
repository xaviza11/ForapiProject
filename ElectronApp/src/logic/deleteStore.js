const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for authenticate one user
 * @param {string} id The id of the item for ddelete
 * @param {string} collection The collection of the item
 * @param {number} secretPass The password for validate cllient
 * @param {string} token The token of the user
 * @param {object} language The object whit the language
 * @param {string} host The host of the api 
 * */

function deleteStore(id, collection, secretPass, token, language, host) {

    try {
        if (typeof id !== 'string') alert(language.idNotString)
        if (typeof secretPass !== 'number') alert(language.secretPassNotNumber)
        if (typeof host !== 'string') alert(langauge.hostNotString)
        if (typeof token !== 'string') alert(langauge.tokenNotString)
        if (typeof collection !== 'string') alert(language.collectionNotString)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!host.length) alert(language.hostEmpty)
        if (!token.length) alert(language.tokenNotString)
        if (!collection.length) alert(language.collectionNotString)
    } catch (error) { throw new LengthError(error) }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            const { status, responseText: json } = xhr

            if (status === 200) {
                const { token, id } = JSON.parse(json)
                resolve({token, id})
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


        xhr.open('delete', host + 'store/delete')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = { id, collection, secretPass}

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = deleteStore