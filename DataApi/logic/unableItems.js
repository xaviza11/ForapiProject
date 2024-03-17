const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { routerInfo, routerDatas, routerStores } = require('../utils/routuerCollections')
const { compare } = require('bcryptjs')
const { ObjectId } = require('mongodb');
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog');
const { UserItems, Users, Stores } = require('../models');
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken');
const { items } = require('../models/schemas');
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This unable store when not has more credits @use 
 * @param {string} token The token of the user
 * @param {string} storeId The storeId for update store 
 */

function unableItems(token, storeId) {

    log('INIT', 'unableItems', ' ---> WORK')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof storeId !== 'string') throw new TypeError( selectedLanguage.storeIdNotString)
    } catch (error) {
        log('ERROR', 'unableItems -> 3 ', error)
        throw new TypeError(error)
    }

    try {
        if (!token) throw new LengthError( selectedLanguage.tokenEmpty)
        if (!storeId) throw new LengthError( selectedLanguage.storeIdEmpty)
    } catch (error) {
        log('ERROR', 'unableItems -> 4 ', error)
        throw new LengthError(error)
    }


    try {
        return Stores.findByIdAndUpdate(storeId , {enable: false})
    } catch (error) {
        log('ERROR', 'unableItems -> 7 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = unableItems