const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for authenticate one user
 * @param {string} email The user email
 * @param {string} password The user password
 * @param {object} language The language of the app
 * @param {number} secretPass A pass for validate request
 */

function authenticateUser(email, password, language, host, secretPass) {

    console.log(host)

    try {
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
        if (typeof email !== 'string') throw new TypeError(language.emailNotString)
        if (typeof password !== 'string') throw new TypeError(language.passwordNotString)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
    } catch (error) { throw new TypeError(error) }

    try {
        if (password.length < 8) throw new LengthError(language.passwordLengthError)
        if (!host.length) throw new LengthError(language.hostEmpty)
    } catch (error) { throw new LengthError(error) }

    try {
        if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(language.emailNotValid)
        if (HAS_SPACES_REGEX.test(password)) throw new FormatError(language.passwordHasSpaces)
    } catch (error) { throw new FormatError(error) }

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

        xhr.onerror = () => alert(language.connectionError)


        xhr.open('POST', host + 'users/auth')
        xhr.setRequestHeader('Content-Type', 'application/json')

        const payload = { email, password, secretPass }

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = authenticateUser