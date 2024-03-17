const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users, Chats, Stores, } = require('../models')
const log = require('../utils/coolog')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const selectedLanguage = require('../utils/languages/es.json')

/**
 * @use This logic create a new order of one furniture @use //! Needs improve it because doesn't works with more than one furniture so users can't create a basket.
 * @param {string} token The token of the user
 * @param {string}storeId The id of the store
 * @param {object} messages One object whit the new message
 * @param {array} item One array whit the items 
 * @param {number} secretPass The secret pass for validate the client
 * @param {string} deadLine One string whit one date
 */

function createChats(data) {

    console.log(data)

    log('INIT', 'createChats -->  ', 'WORK')

    try {
        return Chats.create({userId: data.userId, storeId: data.storeId, userName: data.userName, storeName: data.storeName, items: data.items, messages: data.messages, date: data.date, chatIsReadingUser: data.chatIsReadingUser, chatIsReadingStore: data.chatIsReadingStore, deadLine: data.deadLine, userImage: data.userImage, storeImage: data.storeImage})
        .then(data => {
            if(data) return {res: true}
            else return {res: false}
        })
    } catch (error) {
        log('ERROR', 'createChats --> 4 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = createChats