const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { compare } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { Users, Stores } = require('../models')
const { routerAdvertisments, routerDatas, routerSearch, routerStores } = require('../utils/routuerCollections')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')

/**
 * @use This logic is used for delete one store @use
 * @param {string} id The id of the furniture
 * @param {string} collection The collection of the store
 * @param {number} secretPass Yhe secretPass for validate client
 * @param {string} Token The token of the user
 */

function deleteStore(id, collection, secretPass, token) {

    log('INIT', 'deleteStore --> ', 'INIT')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
        if (typeof id !== 'string') throw new TypeError( selectedLanguage.idNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotValid)
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
    } catch (error) {
        log('ERROR', 'deleteAccount --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!id.length) throw new LengthError( selectedLanguage.idEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'deleteAccount --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        const storesRouter = routerStores(collection)
        const dataRouter = routerDatas(collection)
        const decodedToken = jwt.decode(token, JWT_SECRET);


        /*return storesRouter.deleteOne({ _id: id })
            .then(() => {
                return dataRouter.deleteMany({ soldBy: id })
                    .then(() => {*/
                        return Users.findById(decodedToken.sub)
                            .then(async user => {

                                for(let i = 0; i < user.stores.length; i++){
                                    if(user.stores[i].storeId.toString() === id){
                                        user.stores.splice(i, 1);
                                        break
                                    }
                                }
                                
                                await user.save()

                                const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
                                return { token, id: id };
                            });
                    //})
        //})
    } catch (error) {
        log('ERROR', 'deleteAccount --> 4 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = deleteStore