const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users } = require('../models')
const { stores } = require('../models/schemas')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This logic retrieve one item @use
 * @param {string}  itemId The id of the user
 * @param {string} collection The collection of the item
 * @param {number} secretPass The secretPass for validate client
 * @param {string} token The token of the user
 */

function retrieveOneItem(itemId, collection, secretPass, token) {

    log('INIT', 'retrieveOneItem -->  ', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError(selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
        if (typeof itemId !== 'string') throw new TypeError(selectedLanguage.idNotString)
        if (typeof collection !== 'string') throw new TypeError(selectedLanguage.collectionNotString)
        if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
    } catch (error) {
        log('ERROR', 'retrieveOneItem --> 1  ', error)
        throw new TypeError(error)
    }

    try {
        if (!itemId.length) throw new LengthError(selectedLanguage.idEmpty)
        if (!collection.length) throw new LengthError(selectedLanguage.collectionEmpty)
        if (!token.length) throw new LengthError(selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'retrieveOneItem --> 2 ', error)
        throw new LengthError(error)
    }

    try {

        const routerItem = routerDatas(collection)

        const decodedToken = jwt.decode(token, JWT_SECRET);

        return routerItem.findById({ _id: itemId })
            .then(item => {
                if (!item) {
                    log('ERROR', 'retrieveOneItem --> 3  ', selectedLanguage.itemsEmpty)
                    throw new TypeError(selectedLanguage.storesEmpty)
                }
                log('SUCCESS', 'retrieveOneItem -->  ', 'SUCCESS')
                return Users.findById(decodedToken.sub)
                    .then(user => {
                        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                        return { token, item }
                    })
            })
    } catch (error) {
        log('ERROR', 'retrieveOneItem --> 4  ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = retrieveOneItem