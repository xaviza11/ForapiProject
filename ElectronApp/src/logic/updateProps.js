const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for authenticate one user
 * @param {string} id The id of the item for update
 * @param {array} props The array whit the new props
 * @param {number} secretPass The pass for validate client
 * @param {string} token The token of the user
 * @param {object} language A object whit language strings
 * @param {string} host The host of the client
 * */

function updateProps(id, props, collection, secretPass, language, host, token) {

    try {
        if (typeof id !== 'string') throw new TypeError(language.idNotString)
        if (typeof collection !== 'string') throw new TypeError(language.collectionNotString)
        if (typeof secretPass !== 'number') throw new TypeError(langauge.secretPassNotNumber)
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof host !== 'string') throw new TypeError(langauge.hostNotString)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!id.length) throw new LengthError(language.idEmpty)
        if (!collection.length) throw new LengthError(langauge.collectionEmpty)
        if (!token.length) throw new LengthError(langauge.tokenEmpty)
        if (!host.length) throw new LengthError(langauge.hostEmpty)
    } catch (error) { throw new LengthError(error) }

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


        xhr.open('PUT', host + 'props/update')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = { id, props, collection, secretPass}

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = updateProps