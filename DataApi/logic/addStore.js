const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { Users, Stores } = require('../models')
const { routerStores } = require('../utils/routuerCollections')
const { compare } = require('bcryptjs')
const { ObjectId } = require('mongodb');
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This logic adds a new store @use
 * @param {String} query One string whit the query used for find the data on outscraper API
 * @param {String} location One string whit the location [latitude, longitude] for place the store
 * @param {String} name The name of the store finded on google
 * @param {String} adress The full adress of the stpre povided by outscraper of google data.
 * @param {String} postalCode The postal code of the store
 * @param {String} country The country where is location the store
 * @param {String} city The city where is location the store
 * @param {String} state The state where is located the store
 * @param {String} webSide The webSide of the store provided by outscraper API
 * @param {String} phone The phone of the store
 * @param {String} type The kind of store
 * @param {String} logo The logo of the store containded in http
 * @param {Number} rating The rating of the store in google provided for outscraper API
 * @param {Number} totalReviews The total reviews of the store in google
 * @param {Array} reviewsData The data of the reviews for retrive in client
 * @param {Object} workingHours The ours when the store it's open
 * @param {Object} reviewsPerScore The number of reviews for each score
 * @param {String} email The email of the store
 * @param {String} owner The user owner of the store
 */

function addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token) {

    log('INIT', 'addStore ---> ', 'WORK')

    const [lat, lon] = location.coordinates.split(', ')
    const parseLat = parseFloat(lat)
    const parseLon = parseFloat(lon)
    const locationParsed = { coordinates: [parseLat, parseLon], type: 'Point' }

    try {
        if (!webSide) webSide = 'none'
        if (!logo) logo = 'none'
        if (!rating) rating = 0
        if (!totalReviews) totalReviews = 0
        if (!workingHours) workingHours = {}
        if (!reviewsData) reviewsData = []
        if (!reviewsPerScore) reviewsPerScore = {}
    } catch (error) { }

    try {
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, email, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.secretPassNotValid)
        if (typeof query !== 'string') throw new TypeError('type:' + selectedLanguage.secretPassNotValid)
        if (typeof parseLat !== 'number') throw new TypeError( selectedLanguage.latNotNumber)
        if (typeof parseLon !== 'number') throw new TypeError( selectedLanguage.lonNotNumber)
        if (typeof adress !== 'string') throw new TypeError( selectedLanguage.addressNotString)
        if (typeof postalCode !== 'string') throw new TypeError( selectedLanguage.postalCodeNotString)
        if (typeof state !== 'string') throw new TypeError( selectedLanguage.stateNotString)
        if (typeof owner !== 'string') throw new TypeError( selectedLanguage.ownerNotString)
        if (typeof type !== 'string') throw new TypeError( selectedLanguage.typeNotString)
        if (typeof logo !== 'string') throw new TypeError( selectedLanguage.logoNotString)
        if (typeof rating !== 'number') throw new TypeError( selectedLanguage.ratingNotString)
        if (typeof totalReviews !== 'number') throw new TypeError( selectedLanguage.totalReviewsNotString)
        if (typeof name !== 'string') throw new TypeError( selectedLanguage.nameNotString)
        if (typeof webSide !== 'string') throw new TypeError( selectedLanguage.webSideNotString)
        if (typeof country !== 'string') throw new TypeError( selectedLanguage.countryNotString)
        if (typeof city !== 'string') throw new TypeError( selectedLanguage.cityNotString)
        if (typeof email !== 'string') throw new TypeError( selectedLanguage.emailNotString)
        if (typeof phone !== 'string') throw new TypeError( selectedLanguage.phoneNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
        if (typeof workingHours !== 'object') throw new TypeError( selectedLanguage.workingHoursNotObject)
        if (typeof reviewsPerScore !== 'object') throw new TypeError( selectedLanguage.reviewsPerScoreNotObject)
        if (Array.isArray(reviewsData) === false) throw new TypeError( selectedLanguage.reviewsDataNotArray)
    } catch (error) {
        log('ERROR', 'addStore -> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
        if (!query.length) throw new LengthError( selectedLanguage.queryEmpty)
        if (!adress.length) throw new LengthError( selectedLanguage.adressEmpty)
        if (!postalCode.length) throw new LengthError( selectedLanguage.postalCodeEmpty)
        if (!phone.length) throw new LengthError( selectedLanguage.phoneEmpty)
        if (!state.length) throw new LengthError( selectedLanguage.stateEmpty)
        if (!owner.length) throw new LengthError( selectedLanguage.ownerEmpty)
        if (!country.length) throw new LengthError( selectedLanguage.countryEmpty)
        if (!email.length) throw new LengthError( selectedLanguage.emailEmpty)
        if (!city.length) throw new LengthError( selectedLanguage.cityEmpty)
        if (!name.length) throw new LengthError( selectedLanguage.nameEmpty)
        if (!type.length) throw new LengthError( selectedLanguage.typeEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'addStore -> 2 ', error)
        throw new LengthError(error)
    }

    try {
        if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(selectedLanguage.emailNotValid)
    } catch (error) {
        log('ERROR', 'addStore -> 3 ', error)
        throw new FormatError(error)
    }

    try {

        return Users.findById(owner)
            .then(user => {
                if (!user) {
                    log('ERROR', 'addStore -> 4 ', 'not user')
                    throw new NotFoundError(selectedLanguage.userNotExist)
                }
                else {
                    log('SUCCESS', 'addStore -> ', 'SUCCESS')
                    return Stores.create({ query: query, location: locationParsed, name: name, adress: adress, postalCode: postalCode, country: country, city: city, state: state, webSide: webSide, phone: phone, type: type, logo: logo, rating: rating, totalReviews: totalReviews, reviewsData: reviewsData, workingHours: workingHours, reviewsPerScore: reviewsPerScore, owner: owner, email: email, date: new Date() })
                        .then(store => {
                            user.stores.push({ storeId: store._id, name: store.name, collection: collection, city: store.city })
                            user.save()
                            const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                            return {token: token, stores: user.stores }
                        })
                }
            })
    } catch (error) {
        log('ERROR', 'addStore -> 5 ', error)
        throw new UnexpectedError(error)
    }
}
module.exports = addStore