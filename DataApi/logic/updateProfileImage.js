const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users, Stores } = require('../models')
const { routerInfo, routerDatas, routerStores } = require('../utils/routuerCollections')
const { compare } = require('bcryptjs')
const { hash } = require('bcryptjs')
const { } = require('com/errors')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const jwt = require('jsonwebtoken')
const passwordValidator = require('../utils/passwordValidator')

/**
 * @use This logic is used for update the profile image of the user @use
 * @param {string} url The url of the image 
 * @param {string}  storeId The id of the sotre
 * @param {number} secretPass The pass for validate client
 * @param {string} token The token of the user
 */

function updateProfileImage(url, storeId, secretPass, token) {

    log('INIT', 'updateProfileImage -->', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof storeId !== 'string') throw new TypeError(selectedLanguage.storeIdNotString)
        //if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
       // if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.secretPassNotValid)
        if (url === 'string') throw new TypeError(selectedLanguage.urlIsNotString)
    } catch (error) {
        log('ERROR', 'updateProfileImage --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!storeId.length) throw new LengthError(selectedLanguage.storesEmpty)
        if (!url.length) throw new LengthError(selectedLanguage.urlEmpty)
        if (!token.length) throw new LengthError(selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'updateProfileImage --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        const decodedToken = jwt.decode(token, JWT_SECRET);
        const userId = decodedToken.sub

        return Users.findById(userId)
            .then(user => {
                if (user.gender === 'Store') {
                    return Stores.findById(storeId)
                        .then(store => {
                            store.image = url
                            store.save()
                            return true
                        })
                }else {
                    user.image = url
                    user.save()
                    return true
                }
            })
    } catch (error) {
        log('ERROR', 'updateProfileImage --> 5 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = updateProfileImage