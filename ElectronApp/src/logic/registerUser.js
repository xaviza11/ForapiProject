const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic sends the data for create a new user
 * @param {string} name The user name 
 * @param {string} email The user email
 * @param {string} password The user password
 * @param {string} repeatPassword The validate of the password
 * @param {string} storeCode The store code for create store
 * @param {string} phone The phone number
 * @param {string} host The host of the api
 * @param {number} secretPass The pass for validate the request
 * */
function registerUser(name, email, password, repeatPassword, storeCode, phone, language, host, secretPass) {
    if (password != repeatPassword) throw new Error('Passwords not match')

    if (!storeCode) storeCode = 'none'

    try {
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
        if (typeof storeCode !== 'string') throw new TypeError(language.storeCodeNotString)
        if (typeof name !== 'string') throw new TypeError(language.nameNotString)
        if (typeof phone !== 'string') throw new TypeError(language.phoneNotString)
        if (typeof email !== 'string') throw new TypeError(language.emailNotString)
        if (typeof password !== 'string') throw new TypeError(language.passwordNotString)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
    } catch (error) { throw new TypeError(error) }

    try {
        if (name.length < 1) throw new LengthError(language.nameEmpty)
        if (password.length < 8) throw new LengthError(language.passwordLengthError)
        if (!phone.length) throw new LengthError(language.phoneEmpty)
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

            if (status === 201)
                resolve()
            else if (status === 400) {
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
            } else if (status < 500) {
                const { error } = JSON.parse(json)
                alert(error)
            } else {
                const { error } = JSON.parse(json)
                alert(error)
            }
        }

        xhr.onerror = () => reject(new Error('connection error'))

        xhr.open('POST', host + 'users/register')
        xhr.setRequestHeader('Content-Type', 'application/json')

        const payload = { name, email, password, storeCode, phone, secretPass }

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = registerUser