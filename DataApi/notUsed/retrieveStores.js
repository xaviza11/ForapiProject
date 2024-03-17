const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users } = require('../models')
const { stores } = require('../models/schemas')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')

/**
 * @use This logic retrieve the stores of the user when it's a store @use
 * @param {string}  userId The id of the user
 * @param {string} collection The collection of the item
 */

function retrieveStores(userId, collection) {

    log('INIT', 'retrieveStores -->  ', 'WORK')

    try {
        if (typeof userId !== 'string') throw new TypeError( selectedLanguage.idNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'retrieveStores --> 1  ', error)
        throw new TypeError(error)
    }

    try {
        if (!userId.length) throw new LengthError( selectedLanguage.userEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'retrieveStores --> 2 ', error)
        throw new LengthError(error)
    }

    const storeRouter = routerStores(collection)

    try {
        return storeRouter.find({ owner: userId })
            .then(stores => {
                if (!stores) {
                    log('ERROR', 'retrieveStores --> 3  ', selectedLanguage.storesEmpty)
                    throw new TypeError(selectedLanguage.storesEmpty)
                }
                const storesId = []
                const storesNames = []
                const storesCities = []
                for (let i = 0; stores.length > i; i++) {
                    const storeId = stores[i]._doc._id.toString()
                    const storeName = stores[i]._doc.name
                    const storeCity = stores[i]._doc.city
                    storesId.push(storeId)
                    storesNames.push(storeName)
                    storesCities.push(storeCity)
                }
                log('SUCCESS', 'retrieveStores -->  ', 'SUCCESS')
                return { storesId, storesNames, storesCities }
            })
    } catch (error) {
        log('ERROR', 'retrieveStores --> 4  ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = retrieveStores