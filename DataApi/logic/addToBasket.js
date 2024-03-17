const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { Basket } = require('../models')
const { routerStores } = require('../utils/routuerCollections')
const { compare } = require('bcryptjs')
const { ObjectId } = require('mongodb');
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This logic adds items on the basket @use
 * @param {String} secretPass One number for validate the password
 * @param {String} token The current token for validate the passord
 * @param {String} id The id of the basket
 * @param {Object} data The data for include on the basker
 */

function addToBasket(secretPass, token, id, data) {

    log('INIT', 'addToBasket ---> ', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.secretPassNotValid)
        if (typeof id !== 'string') throw new TypeError( selectedLanguage.idNotString)
        if (typeof data !== 'object') throw new TypeError( selectedLanguage.invalidData)
    } catch (error) {
        log('ERROR', 'addToBasket -> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!id.length) throw new LengthError( selectedLanguage.idEmpty)
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'addToBasket -> 2 ', error)
        throw new LengthError(error)
    }

    try {
        const decodedToken = jwt.decode(token, JWT_SECRET)
        const userId = decodedToken.sub
        
        return Basket.findById(id)
            .then(basket => {
                basket.items.push(data)
                basket.save()
                const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                return token
            })
    } catch (error) {
        log('ERROR', 'addToBasket -> 5 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = addToBasket