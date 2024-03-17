const { errors: { FormatError, NotFoundError, UnexpectedError, LengthError } } = require('com')
const {} = require('../models')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')

/**
 * @use This logic retrieve the furniture of current user if the user is store only @use
 * @param {string}  userId The userId for retrieve
 * @param {string} collection The collection
 */

function createOwnerFurniture(userId, collection) {

    log('INIT', 'createOwnerFurniture --> ', 'WORK')

    try {
        if (typeof userId !== 'string') throw new TypeError( selectedLanguage.userNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
    } catch (error) {
        log('ERROR', 'createOwnerFurniture --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!userId) throw new LengthError( selectedLanguage.userEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'createOwnerFurniture --> 2 ', error)
        throw new LengthError(error)
    }

    try {

        const storeRouter = routerStores(collection)
        const infoRouter = routerInfo(collection)
        const dataRouter = routerDatas(collection)

        return storeRouter.find({ owner: userId })
            .then(stores => {
                if (!stores.length) throw new NotFoundError(selectedLanguage.storesNotExist)
                const storeId = []
                for (let i = stores.length; i > 0; i--) {
                    storeId.push(stores[i - 1]._id.toString())
                }
                return dataRouter.find({ soldBy: { $in: storeId } })
                    .then(furnitureData => {
                        if (!furnitureData.length) {
                            log('ERROR', 'createOwnerFurniture --> 3 ', error)
                            throw new NotFoundError(selectedLanguage.notFurnitures + ' 1')
                        }
                        const infoIdArr = []
                        for (let i = furnitureData.length - 1; i >= 0; i--) {
                            infoIdArr.push(furnitureData[i].infoId.toString())
                        }
                        return infoRouter.find({ _id: { $in: infoIdArr } })
                            .then(furnitureInfos => {
                                if (!furnitureInfos.length) {
                                    log('ERROR', 'createOwnerFurniture --> 4 ', error)
                                    throw new NotFoundError(selectedLanguage.notFurnitures + ' 2')
                                }
                                const data = []
                                for (let i = furnitureData.length - 1; i >= 0; i--) {
                                    const obj = []
                                    for (let j = furnitureInfos.length - 1; j >= 0; j--) {
                                        if (furnitureInfos[j]) {
                                            if (furnitureData[i].infoId.toString() === furnitureInfos[j]._doc._id.toString()) {
                                                obj.push(furnitureData[i]._doc.price)
                                                obj.push(furnitureInfos[j]._doc.description)
                                                obj.push(furnitureInfos[j]._doc._id)
                                                obj.push(furnitureInfos[j]._doc.title)
                                                obj.push(furnitureData[i]._doc.soldBy)
                                                obj.push(furnitureData[i]._doc.sizes)
                                                obj.push(furnitureData[i]._doc._id)
                                                for (let k = stores.length - 1; k >= 0; k--) {
                                                    if (furnitureData[i].soldBy.toString() === stores[k]._id.toString()) {
                                                        obj.push(stores[k]._doc.name)
                                                        obj.push(stores[k].city)
                                                    }
                                                }
                                                data.push({ price: obj[0], description: obj[1], furnitureId: obj[2], title: obj[3], soldBy: obj[4], sizes: obj[5], furnitureDataId: obj[6], storeName: obj[7], city: obj[8] },)
                                            }
                                        }
                                    }
                                }
                                log('SUCCESS', 'createOwnerFurniture --> ', 'SUCCESS')
                                return { data }
                            })
                    })
            })
    } catch (error) {
        log('ERROR', 'createOwnerFurniture --> 5 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = createOwnerFurniture