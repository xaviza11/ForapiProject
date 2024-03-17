const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * this logic send the data for retrieve a user
 * @param {string} token The user token
 * @param {string} email The email of the user
 * @param {object} language The language of the app
 * @param {string} host The host of the app
 * @param {number} secretPass A pass for validate the requests 
 */

function retrieveUser(token, language, host, secretPass) {

    try {
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!token.length) throw new LengthError(language.tokenEmpty)
        if (!host.length) throw new LengthError(language.hostEmpty)
    } catch (error) { throw new LengthError(error) }

    return new Promise((resolve, alert) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = function () {
            const { status, responseText: json } = xhr

            if (status === 200) {
                const user = JSON.parse(json)
                resolve(user)
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
            } else if (status <= 500) {
                const { error } = JSON.parse(json)
                alert(error)
            }
        }

        xhr.open('POST', host + 'users')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = {secretPass}

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = retrieveUser