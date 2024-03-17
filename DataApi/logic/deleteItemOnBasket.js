const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { compare } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const { Basket } = require('../models')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')

/**
 * @use This logic is used for delete one item inside basket @use
 * @param {string} id The id of the basket
 * @param {string} index The index of the item inside the basket
 * @param {number} secretPass Yhe secretPass for validate client
 * @param {string} Token The token of the user
 */

function deleteItemOnBasket(id, index, secretPass, token) {

    log('INIT', 'deleteItemOnBasket --> ', 'INIT')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
        if (typeof id !== 'string') throw new TypeError( selectedLanguage.idNotString)
        if (typeof index !== 'number') throw new TypeError( selectedLanguage.collectionNotString)
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tagsNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotValid)
    } catch (error) {
        log('ERROR', 'deleteAccount --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!id.length) throw new LengthError( selectedLanguage.idEmpty)
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'deleteAccount --> 2 ', error)
        throw new LengthError(error)
    }

    try {
       return Basket.findById(id)
        .then(basket => {
            basket.items.splice(index, 1);
            basket.save()
            const token = jwt.sign({sub: basket.userId}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})
            return {token: token}
        })
    } catch (error) {
        log('ERROR', 'deleteAccount --> 4 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = deleteItemOnBasket