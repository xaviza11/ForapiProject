const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const { Users, RenovationTokens } = require('../models')
const { compare } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const createRenovationToken = require('../utils/createRenovationToken')
const createApiKey = require('../utils/createApiKey')

/**
 * @use This logic authenticate a user @use 
 * @param {string} email The user email
 * @param {string} password The user password
 * @param {number} secretPass The pass for validate client
 */

function authenticateUser(email, password, secretPass) {

    log('INIT', 'autenticatheUser', ' ---> WORK')

    try {
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator('thisIsLogIn', email, secretPass)
        //if(isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.secretPassNotValid) 
        if (typeof email !== 'string') throw new TypeError( selectedLanguage.emailNotString)
        if (typeof password !== 'string') throw new TypeError( selectedLanguage.passwordNotString)
    } catch (error) {
        log('ERROR', 'autenticatheUser ---> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (password.length < 8) throw new LengthError( selectedLanguage.passwordEmpty)
    } catch (error) {
        log('ERROR', 'autenticatheUser ---> 2 ', error)
        throw new LengthError(error)
    }

    try {
        if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(selectedLanguage.emailNotValid)
        if (HAS_SPACES_REGEX.test(password)) throw new FormatError(selectedLanguage.passwordNotValid)
    } catch (error) {
        log('ERROR', 'autenticatheUser ---> 3 ', error)
        throw new FormatError(error)
    }

    try {
        return Users.findOne({ email })
            .then(user => {
                if (!user) {
                    log('ERROR', 'autenticatheUser ---> 4 ', selectedLanguage.userNotExist)
                    throw new NotFoundError(selectedLanguage.userNotExist)
                }
                return compare(password, user.password)
                    .then(match => {
                        if (!match) {
                            log('ERROR', 'autenticatheUser ---> 5 ', selectedLanguage.wrongPassword)
                            throw new AuthError(selectedLanguage.wrongPassword)
                        }
                        return RenovationTokens.findOne({ userId: user._id })
                            .then(async res => {

                                const apiKey = await createApiKey()
                                const token = jwt.sign({sub: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})

                                if (res === null) {
                                    const renovateToken = jwt.sign({ sub: user._id }, JWT_SECRET_RENOVATE, { expiresIn: JWT_RENOVATION })
                                    const apiKey = await createApiKey()
                                    createRenovationToken(user._id, renovateToken, apiKey)

                                    log('SUCCESS', ' authenticateUser ---> ', 'SUCCESS')
                                    return token
                                }else{
                                    res.apiKey = apiKey
                                    await res.save()
                                    return token
                                }
                            })
                    })
            })
    } catch (error) {
        log('ERROR', 'autenticatheUser ---> 6 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = authenticateUser