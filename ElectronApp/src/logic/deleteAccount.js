const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')
/**
 * This logic send the email and password of the user for delete the current account
 * @param {token} token The token
 * @param {string} password The current password for delete the account
 * @param {object} language The language of the app
 * @param {string} host The host of the api
 * @param {number} secretPass The pass for validate the client
 */
function deleteAccount(token, password, language, host, secretPass) {

    try {
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof password !== 'string') throw new TypeError(language.passwordNotString)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
        if (typeof language !== 'object') throw new TypeError(language.notObject)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!token.length) throw new LengthError(language.tokenEmpty)
        if (!password.length) throw new LengthError(language.passwordEmpty)
        if (!host.length) throw new LengthError(language.hostEmpty)
    } catch (error) { throw new LengthError(error) }

    return new Promise((resolve, alert) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            const { status, responseText: json } = xhr

            if (status === 200) {
                const data = JSON.parse(json)
                resolve(data)
            } else if (status === 400) {
                const { error } = JSON.parse(json)
                if (error.includes('type'))
                    alert(error)
                else if (error.includes('format'))
                    alert(error)
                else if (error.includes('length'))
                    alert(error)
            } else if (status === 409) {
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

        xhr.onerror = () => alert(new Error(language.connectionError))

        xhr.open('DELETE', host + 'account/delete')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = { password, secretPass }

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = deleteAccount