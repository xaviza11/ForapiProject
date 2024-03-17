/*const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { compare } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const {routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch} = require('../utils/routuerCollections')

/**
 * This logic is used for delete one furniture. //?only can be used for the stores user
 * @param {string} id The id of the item
 * @param {string} collection The collection the item
 */

/*function deleteOneFurniture(id, collection) {

    log('INIT', 'deleteOneFurniture --> ', 'INIT')

    try {
        if (typeof id !== 'string') throw new TypeError('type:  ' + selectedLanguage.idNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
    } catch (error) {
        log('ERROR', 'deleteAccount --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!id.length) throw new LengthError('length:  ' + selectedLanguage.idEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'deleteAccount --> 2 ', error)
        throw new LengthError(error)
    }

    try {

        const storeRouter = routerStores(collection)

        return storeRouter.findByIdAndDelete(id)
            .then(store => {})
    } catch (error) { 
        log('ERROR', 'deleteAccount --> 4 ', error)
        throw new UnexpectedError(error) }
}

module.exports = deleteOneFurniture*/