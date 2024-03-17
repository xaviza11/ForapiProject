const { errors: { FormatError, NotFoundError, LengthError, UnexpectedError } } = require('com')
const { Users, UserItems } = require('../models')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This logics retrieve the id of the userItems data. @use
 * @param {string} id The id of the user
 * @param {number} secretPass A password for validate client
 * @param {string} token The token of the user
 */

function retrieveUserItems(id, secretPass, token) {
    log('INIT', 'retrieveUserItems -->  ', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
       if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.secretPassNotValid)
        if (typeof id !== 'string') throw new TypeError( selectedLanguage.idNotString)
    } catch (error) {
        log('ERROR', 'retrieveUserItems --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!id.length) throw new LengthError( selectedLanguage.idEmpty)
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'retrieveUserItems --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        return UserItems.findById(id)
            .then(itemsList => {
                delete itemsList._id
                return Users.findById(itemsList.userId)
                    .then(user => {
                        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                        return {token, items: itemsList.items}
                    })
            })
    } catch (error) {
        log('ERROR', 'retrieveUserItems --> 4 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = retrieveUserItems