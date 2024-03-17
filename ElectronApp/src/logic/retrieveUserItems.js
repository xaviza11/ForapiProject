const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for authenticate one user
 * @param {string} email The user email
 * @param {Array} images The array of the iamges
 * @param {string} collection The collection of the furniture
 * @param {number} secretPass The number for validate the client
 * @param {string} token The token of the user
 * @param {string} id The id of the item
 * @param {object} language The object whit the language
 * @param {string} host The host of the api 
 * */

function retrieveUserItem(id, secretPass, token, language, host) {

    try {
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof id !== 'string') throw new TypeError(language.idNotString)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!host.length) throw new LengthError(language.hostEmpty)
        if (!token.length) throw new LengthError(language.tokenEmpty)
        if (!id.length) throw new LengthError(language.idEmpty)
    } catch (error) { throw new LengthError(error) }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            const { status, responseText: json } = xhr

            if (status === 200) {
                const { token, items } = JSON.parse(json)
                console.log(token, items)
                resolve({token, items})
            } else if (status === 400) {
                const { error } = JSON.parse(json)
                console.log(error)
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


        xhr.open('POST', host + 'userItems/retrieve')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = { id, secretPass}

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = retrieveUserItem