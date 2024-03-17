const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for update one user
 *@param {string} token The token  
 * @param {string} password The user password
 * @param {string} newEmail The nwe email for the user
 * @param {string} newPassword The new password for the user
 * @param {string} newName The new Name for the user
 * @param {string} newPhone The new phone for the user
 * @param {object} language The language of the app
 * @param {string} host The host of the api
 * @param {number} secretPass The number for validate the client
 * */

function updateUser(token, password, newEmail, newPassword, newName, newPhone, language, host, secretPass) {


    try {
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof newPassword !== 'string') throw new TypeError(language.passwordNotString)
        if (typeof newName !== 'string') throw new TypeError(language.nameIsNotString)
        if (typeof newEmail !== 'string') throw new TypeError(language.emailNotString)
        if (typeof newPhone !== 'string') throw new TypeError(language.phoneNotString)
        if (typeof host !== 'string') throw new TypeError(langauge.hostNotString)
        if (typeof language !== 'object') throw new TypeError(language.languageNotObject)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!host.length) throw new LengthError(langauge.hostEmpty)
    } catch (error) { throw new LengthError(error) }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            const { status, responseText: json } = xhr
            if (status === 200) {
                const data = JSON.parse(json)
                resolve(data)
            }
            else if (status === 400) {
                const { error } = JSON.parse(json)
                if (error.includes('type'))
                    reject(new TypeError(error))
                else if (error.includes('format'))
                    reject(new FormatError(error))
                else if (error.includes('length'))
                    reject(new LengthError(error))
            } else if (status === 409) {
                const { error } = JSON.parse(json)
                reject(new ConflictError(error))
            } else if (status > 500) {
                const { error } = JSON.parse(json)
                reject(console.log(error))
            }
        }

        xhr.onerror = () => reject(new Error(language.connectionError))

        xhr.open('PUT', host + 'account/update')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = {password, newEmail, newPassword, newName, newPhone, secretPass }

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = updateUser