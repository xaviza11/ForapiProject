const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { } = require('../models')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')

/**
 * @use This logic create a new advertisement @use
 * @param {string} furnitureId The id of the furniture
 * @param {string} location The location for create the advertisement
 * @param {string} collection The collection of the addverstiment
 */

function createAdd(furnitureId, location, collection) {

    log('INIT', 'createAdd --->  ', 'WORK')

    try {
        if (typeof furnitureId !== 'string') throw new TypeError( selectedLanguage.furnitureNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
    } catch (error) {
        log('ERROR', 'createAdd ---> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
        if (!furnitureId) throw new LengthError( selectedLanguage.furnitureEmpty)
        if (!location.length) throw new LengthError( selectedLanguage.locationEmpty)
    } catch (error) {
        log('ERROR', 'createAdd ---> 2 ', error)
        throw new LengthError(error)
    }

    try {

        const dataRouter = routerStores(collection)
        const advertisementRouter = routerAdvertisments(collection)

        return dataRouter.findById({ _id: furnitureId })
            .then(furniture => {
                if (!furniture) {
                    log('ERROR', 'createAdd ---> 3 ', selectedLanguage.furnitureEmpty)
                    throw new NotFoundError(selectedLanguage.furnitureEmpty)
                }
                const date = new Date()
                return advertisementRouter.create({ furnitureId: furniture._doc._id, location: location, tags: furniture._doc.tags, date: date })
                    .then(log('SUCCESS', 'createAdd ---> ', 'SUCCESS'))
                    .catch(error => {
                        if (error.message.includes('E11000')) {
                            log('ERROR', 'createAdd ---> 4 ', 'user with email ${email} already exists')
                            throw new ConflictError(selectedLanguage.userAlreadyExist)
                        }

                        throw new UnexpectedError(error.message)
                    })
            })
    } catch (error) {
        log('ERROR', 'createAdd ---> 5 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = createAdd