const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users, Chats, Stores, } = require('../models')
const log = require('../utils/coolog')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')
const selectedLanguage = require('../utils/languages/es.json')
const axios = require('axios')

/**
 * @use This logic create a new order of one furniture @use //! Needs improve it because doesn't works with more than one furniture so users can't create a basket.
 * @param {string} token The token of the user
 * @param {string}storeId The id of the store
 * @param {object} messages One object whit the new message
 * @param {array} item One array whit the items 
 * @param {number} secretPass The secret pass for validate the client
 * @param {string} collection The collection //!not used
 * @param {string} deadLine One string whit one date
 */

function newOrder(token, storeId, messages, item, secretPass, collection, deadLine) {

    log('INIT', 'newOrder -->  ', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionEmpty)
        if (typeof messages !== 'object') throw new TypeError( selectedLanguage.messagesEmpty)
        if (!Array.isArray(item)) throw new TypeError( selectedLanguage.itemNotArray)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        if (typeof deadLine !== 'string') throw new TypeError( selectedLanguage.deadLineNotString)
    } catch (error) {
        log('ERROR', 'newOrder --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
        if (!storeId.length) throw new LengthError( selectedLanguage.storeIdEmpty)
        if (!item.length) throw new LengthError( selectedLanguage.itemsEmpty)
        if (!deadLine.length) throw new LengthError( selectedLanguage.deadLineNotLength)
    } catch (error) {
        log('ERROR', 'newOrder --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        const decodedToken = jwt.decode(token, JWT_SECRET);
        const userId = decodedToken.sub

        return Users.findById({ _id: userId })
            .then(user => {
                if (!user) {
                    log('ERROR', 'newOrder --> 3 ', 'not user')
                    throw new NotFoundError(selectedLanguage.userNotExist)
                }

                return Stores.findById({ _id: storeId })
                    .then(store => {
                        return Users.findById({ _id: store.owner })
                            .then(storeUser => {

                                log('SUCCESS', 'newOrder -->  ', 'SUCCESS')
                                return Chats.create({ userId: userId, storeId: storeUser._id, userName: user.name, storeName: store.name, messages: messages, items: item, date: new Date(), deadLine: deadLine, userImage: user.image, storeImage: store.image })
                                .then(order => {
                                    const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
                                    return {token, storePhone: storeUser.phone}
                                })
                            })
                    })
            })
    } catch (error) {
        log('ERROR', 'newOrder --> 4 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = newOrder