const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users, Stores } = require('../models')
const { stores } = require('../models/schemas')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This logic retrieve one store @use 
 * @param {string}  storeId The id of the store
 * @param {string} collection The collection of the store
 * @param {number} secretPass The number for validate client
 * @param {string} token The token of the user
 */

function retrieveOneStore(storeId, collection, secretPass, token) {

    log('INIT', 'retrieveOneStores -->  ', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
        if (typeof storeId !== 'string') throw new TypeError( selectedLanguage.idNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
    } catch (error) {
        log('ERROR', 'retrieveOneStores --> 1  ', error)
        throw new TypeError(error)
    }

    try {
        if (!storeId.length) throw new LengthError( selectedLanguage.storesEmpty)
        if (!collection.length) throw new LengthError(selectedLanguage.collectionEmpty)
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'retrieveOneStores --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        const decodedToken = jwt.decode(token, JWT_SECRET);

        return Stores.findById(storeId)
            .then(store => {
                if (!store) {
                    log('ERROR', 'retrieveOneStores --> 3  ', selectedLanguage.storesEmpty)
                    throw new TypeError(selectedLanguage.storesEmpty)
                }
                log('SUCCESS', 'retrieveOneStores -->  ', 'SUCCESS')
                return Users.findById(decodedToken.sub)
                .then(user => {
                    const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                    return {token, name: store.name, webSide: store.webSide}
                })
            })
    } catch (error) {
        log('ERROR', 'retrieveOneStores --> 4  ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = retrieveOneStore