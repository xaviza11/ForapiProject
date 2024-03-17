const { errors: { FormatError, NotFoundError, LengthError, UnexpectedError } } = require('com')
const { Users } = require('../models')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')

/**
 * @use This logics retrieve the token and the user data when the user login. @use
 * @param {string} token The token of the user
 * @param {number} secretPass The pass for validate client
 */

function retrieveUser(token, secretPass) {

    log('INIT', 'retrieveUser -->  ', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if(isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
    } catch (error) {
        log('ERROR', 'retrieveUser --> 1 ', error)
        throw new TypeError(error) }

        try{
            if (!token.length) throw new LengthError(selectedLanguage.tokenEmpty)
        }catch(error){
            log('ERROR', 'retrieveUser --> 2 ', error)
            throw new LengthError(error)
        }

    try {

        const decodedToken = jwt.decode(token, JWT_SECRET);
        const userId = decodedToken.sub

        return Users.findById(userId).select('-password').lean()
            .then(user => {
                if (!user){
                    log('ERROR', 'retrieveUser --> 3 ', error)
                    throw new NotFoundError(selectedLanguage.userNotExist)
                } 
                const token = jwt.sign({sub: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})

                const stores = user.stores
                const itemsList = user.itemsList

                delete user._id
                delete user.phone
                delete user.date
                delete user.stores
                delete user.itemsList

                log('SUCCESS', 'retrieveUser --> ', 'SUCCESS')
                return {user: user, token: token, stores: stores, itemsList: itemsList}
            })
    } catch (error) { 
        log('ERROR', 'retrieveUser --> 4 ', error)
        throw new UnexpectedError(error) }
}

module.exports = retrieveUser