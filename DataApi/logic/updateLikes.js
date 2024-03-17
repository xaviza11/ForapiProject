const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX, }
} = require('com')
const { Likes } = require('../models')
const { hash } = require('bcryptjs');
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')

/**
 * @use This logic create or update the list of likes. @use  //! Needs to add a limit and delete the furniture when pass it
 * @param {string} token The token of the user.
 * @param {string} furnitureId The id of the furniture
 * @param {number} index The number of the likes
 * @param {number} secretPass The secretPass for validate client
 * @param {string} collection The collection of the item 
 */

function updateLikes(token, furnitureId, index, secretPass, collection) {

    log('INIT', 'updateLikes -->  ', 'WORK')

    try {
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        if  (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if(isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
        if (typeof furnitureId !== 'string') throw new TypeError( selectedLanguage.furnitureNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
    } catch (error) {
        log('ERROR', 'updateLikes --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!furnitureId.length) throw new LengthError( selectedLanguage.furnitureEmpty)
        if (index > 1 || index < -1) throw new LengthError( selectedLanguage.invalidData)
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'updateLikes --> 2 ', error)
        throw new LengthError(error)
    }

    try {

        const decodedToken = jwt.decode(token, JWT_SECRET);
        const userId = decodedToken.sub

        const dataRouter = routerDatas(collection)

        return dataRouter.findByIdAndUpdate({ _id: furnitureId }, { $inc: { numberLikes: index } })
            .then(furnitureData => {
                if (!furnitureData) {
                    log('ERROR', 'updateLikes --> 3 ', selectedLanguage.furnitureEmpty)
                    throw new NotFoundError(selectedLanguage.furnitureEmpty)
                }
                if (index > 0) {
                    return Likes.findOneAndUpdate({ owner: userId }, { $push: { likes: {id: furnitureId, collection: collection} } })
                        .then(likeData => {
                            if (!likeData){
                                return Likes.create({ owner: userId,  likes: [{id: furnitureId, collection: collection}] })
                                .then(() =>{
                                    const token = jwt.sign({sub: decodedToken.sub}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})
                                    return token
                                })
                            }else {
                                const token = jwt.sign({sub: decodedToken.sub}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})
                                return token
                            } 
                        })
                        .catch(() => {
                            return Likes.create({ owner: userId,  likes: [{id: furnitureId, collection: collection}] })
                            .then(() =>{
                                const token = jwt.sign({sub: decodedToken.sub}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})
                                return token
                            })
                        })
                } else if (index < 0) {
                    log('SUCCESS', 'updateLikes --> ', 'SUCCESS')
                    return Likes.findOneAndUpdate({ owner: userId }, { $pop: { likes: -1 } })
                    .then(() => {
                        const token = jwt.sign({sub: decodedToken.sub}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})
                        return token
                    }) 
                }
            })
    } catch (error) {
        log('ERROR', 'updateLikes --> 4 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = updateLikes