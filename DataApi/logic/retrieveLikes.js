const { errors: { FormatError, LengthError, NotFoundError, UnexpectedError } } = require('com')
const { Users, Likes, FurnitureData, Searches, Stores } = require('../models')
const { } = require('com/errors')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')
const { routerAdvertisments, routerDatas } = require('../utils/routuerCollections')

/**
 * @use This logic is used to retrieve a list of furniture when user liked them before @use
 * @param {string} token The token of the user
 * @param {number} secretPass The secretPass for validate client
 */

function retrieveLikes(token, secretPass) {

    log('INIT', 'retrieveLikes -->  ', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
    } catch (error) {
        log('ERROR', 'retrieveLikes --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'retrieveLikes --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        const decodedToken = jwt.decode(token, JWT_SECRET);
        let userId = decodedToken.sub

        return Likes.findOne({ owner: userId })
            .then(likes => {

                if(!likes) throw new NotFoundError(selectedLanguage.likesNotExist)
    
                const items = [];
                const promises = [];
    
                for (let i = 0; i < likes.likes.length; i++) {
                    const dataRouter = routerDatas(likes.likes[i].collection);
                    const promise = dataRouter.findOne({ _id: likes.likes[i].id.toString() })
                        .then(async itemData => {

                            if(!itemData) throw new TypeError(selectedLanguage.likesNotExist)

                            const storeId = itemData.soldBy
                            const stores = await Stores.findById(storeId)
                            await itemData.storeInfo.push(stores)
                            items.push(itemData);
                        });
    
                    promises.push(promise);
                }
    
                return Promise.all(promises)
                    .then(() => {
                        const decodedToken = jwt.decode(token, JWT_SECRET);
    
                        return Users.findById(decodedToken.sub)
                            .then(user => {
                                        const newToken = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
                                        return { furniture: items, token: newToken };
                            });
                    });
            });
    } catch (error) {
        log('ERROR', 'retrieveLikes --> 7 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = retrieveLikes