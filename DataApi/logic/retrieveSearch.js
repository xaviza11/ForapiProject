const { errors: { FormatError, NotFoundError, UnexpectedError, LengthError } } = require('com')
const { Searches, Stores } = require('../models')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')

/**
 * @use This logic retrieve the searched items @use
 * @param {string} token The token of the user
 * @param {string} id The id of the search
 * @param {string} collection The collection of the item
 * @param {number} secretPass The secret pass for validate client
 */

async function retrieveSearch(token, id, collection, secretPass) {

    log('INIT', 'retrieveSearch -->  ', 'INIT')

    try {
        if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError(selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(null, token, secretPass)
        //if (isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
        if (typeof id !== 'string') throw new TypeError(selectedLanguage.idNotString)
        if (typeof collection !== 'string') throw new TypeError(selectedLanguage.collectionNotString)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!id.length) throw new LengthError(selectedLanguage.idEmpty)
        if (!collection.length) throw new LengthError(selectedLanguage.collectionEmpty)
        if (!token.length) throw new LengthError(selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'retrieveSearch --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        const search = await Searches.findOne({ _id: id });

        if (!search) {
            console.error('ERROR', 'retrieveSearch --> 3 ', selectedLanguage.empty);
            throw new NotFoundError(selectedLanguage.empty);
        }

        const items = [];

        for (let i = 0; i < search.furniture.length; i++) {
            const dataRouter = routerDatas(search.furniture[i].collection);

            const furniture = await dataRouter.findById(search._doc.furniture[i].id);

            if (!furniture) {
                console.error('ERROR', 'retrieveSearch --> 4 ', selectedLanguage.furnitureEmpty);
                throw new NotFoundError(selectedLanguage.furnitureEmpty);
            }

            const storeId = furniture.soldBy
            const stores = await Stores.findById(storeId);

            if (!stores) {
                console.error('ERROR', 'retrieveSearch --> 6 ', selectedLanguage.storesEmpty);
                throw new NotFoundError(selectedLanguage.storesEmpty);
            }

            furniture._doc.storeInfo.push(stores._doc)

            items.push(furniture._doc);
        }

        const pA = search._doc.search;
        const pB = search._doc.index;
        const pC = search._doc.orderBy;

        log('SUCCESS', 'retrieveSearch --> ', 'SUCCESS');

        return { furniture: items, pA, pB, pC };
    } catch (error) {
        log('ERROR', 'retrieveSearch --> 7 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = retrieveSearch



