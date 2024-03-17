const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { } = require('../models')
const { compare } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerDatas, routerInfo, } = require('../utils/routuerCollections')

/**
 * @use This logic retrieve the data for make graphs. @use //! I need to think where increase the number of visits etc... so it not show the data actually but it's working fine 
 *
 *  @param {string}  userId The userId of the furniture
 * @param {string} collection collection is not string
  */

function retrieveGraphicData(userId, collection) {

    log('INIT', 'retrieveGraphicData --> ', 'WORK')

    try {
        if (typeof userId !== 'string') throw new TypeError( selectedLanguage.idNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
    } catch (error) {
        log('ERROR', 'retrieveGraphicData --> 1  ', error)
        throw new TypeError(error)
    }

    try {
        if (!userId) throw new LengthError( selectedLanguage.userEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'retrieveGraphicData --> 2  ', error)
        throw new LengthError(error)
    }

    const storeRouter = routerStores(collection)
    const dataRouter = routerDatas(collection)
    const infoRouter = routerInfo(collection)

    try {
        return storeRouter.find({ owner: userId })
            .then(stores => {
                if (!stores) {
                    log('ERROR', 'retrieveGraphicData --> 3  ', selectedLanguage.storesEmpty)
                    throw new NotFoundError(selectedLanguage.storesEmpty)
                }
                const result = []
                const storesId = []
                for (let i = stores.length - 1; i >= 0; i--) {
                    storesId.push(stores[i]._id.toString())
                }
                return dataRouter.find({ soldBy: { $in: storesId } })
                    .then(furnitureData => {
                        if (!furnitureData) {
                            log('ERROR', 'retrieveGraphicData --> 4  ', selectedLanguage.furnitureEmpty)
                            throw new NotFoundError(selectedLanguage.furnitureEmpty)
                        }
                        const infoIdArr = []
                        for (let i = furnitureData.length - 1; i >= 0; i--) {
                            infoIdArr.push(furnitureData[i].infoId.toString())
                        }
                        return infoRouter.find({ _id: { $in: infoIdArr } })
                            .then(furnitureInfos => {
                                if (!furnitureInfos) {
                                    log('ERROR', 'retrieveGraphicData --> 5  ', selectedLanguage.furnitureEmpty)
                                    throw new NotFoundError(selectedLanguage.furnitureEmpty)
                                }
                                for (let i = furnitureData.length - 1; i >= 0; i--) {
                                    const data = []
                                    const obj = []
                                    for (let j = furnitureInfos.length - 1; j >= 0; j--) {
                                        if (furnitureInfos[j]) {
                                            if (furnitureData[i].infoId.toString() === furnitureInfos[j]._doc._id.toString()) {
                                                obj.push(furnitureData[i]._doc.type) //type
                                                obj.push(furnitureInfos[j]._doc.colors) //colors
                                                obj.push(furnitureInfos[j]._doc.title) //titles
                                                obj.push(furnitureData[i]._doc.price)
                                                obj.push(furnitureData[i]._doc.numberVisits)
                                                obj.push(furnitureData[i]._doc.numberLikes)
                                                for (let k = stores.length - 1; k >= 0; k--) {
                                                    if (furnitureData[i].soldBy.toString() === stores[k]._id.toString()) {
                                                        obj.push(stores[k]._doc.name)
                                                        obj.push(stores[k].city)
                                                    }
                                                }
                                                data.push({ type: obj[0], colors: obj[1], title: obj[2], numberVisits: obj[4], numberLikes: obj[5], city: obj[6], price: obj[3] })
                                                result.push({ type: obj[0], colors: obj[1], title: obj[2], numberVisits: obj[4], numberLikes: obj[5], city: obj[6], price: obj[3] })
                                            }
                                        }
                                    }
                                }
                                log('SUCCESS', 'retrieveGraphicData -->  ', 'SUCCESS')
                                return { result }
                            })
                    })
            })
    } catch (error) {
        log('ERROR', 'retrieveGraphicData --> 6  ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = retrieveGraphicData