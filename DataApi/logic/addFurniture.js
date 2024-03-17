const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { routerInfo, routerDatas, routerStores } = require('../utils/routuerCollections')
const { compare } = require('bcryptjs')
const { ObjectId } = require('mongodb');
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog');
const { UserItems, Users, Stores } = require('../models');
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This logic adds a new product in de data base @use
 * @param {string} title The title of the product
 * @param {string} description The description of the product
 * @param {string} reference The reference of the forniture 
 * @param {number} price The price of the product
 * @param {Array}  props The props of the product inside one array
 * @param {Array} img The img array of the product
 * @param {String} soldBy The id of the store.
 * @param {number} secretPass The pass for validate the client 
 * @param {string} token The token for validate the client
 * @param {string} collection The collection of the item
 */

function addFurniture(price, title, description, props, images, inventories, soldBy, collection, reference, secretPass, token, currency) {

    log('INIT', 'addFurniture', ' ---> WORK')

    const priceParsed = parseFloat(price)

    try {
        if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError(selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError( selectedLanguage.secretPassNotValid)
        if (typeof priceParsed !== 'number') throw new TypeError(selectedLanguage.priceParsedNotNumber)
        if (typeof title !== 'string') throw new TypeError(selectedLanguage.titleNotString)
        if (typeof description !== 'string') throw new TypeError(selectedLanguage.descriptionNotString)
        if (typeof collection !== 'string') throw new TypeError(selectedLanguage.collectionNotString)
        if (typeof soldBy !== 'string') throw new TypeError(selectedLanguage.soldByNotString)
        if (!Array.isArray(props)) throw new TypeError(selectedLanguage.propsNotArray)
        if (!Array.isArray(images)) throw new TypeError(selectedLanguage.imgNotArray)
        if (typeof currency !== 'string') throw new TypeError(selectedLanguage.currencyNotString)
    } catch (error) {
        log('ERROR', 'addFurniture -> 3 ', error)
        throw new TypeError(error)
    }

    try {
        if (!token.length) throw new LengthError(selectedLanguage.tokenEmpty)
        if (!title.length) throw new LengthError(selectedLanguage.titleEmpty)
        if (!description.length) throw new LengthError(selectedLanguage.descriptionEmpty)
        if (!soldBy.length) throw new LengthError(selectedLanguage.soldByEmpty)
        if (!collection.length) throw new LengthError(selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'addFurniture -> 4 ', error)
        throw new LengthError(error)
    }


    try {

        const dataRouter = routerDatas(collection)

        const tags = []

        const extractedValues = props.map(obj => Object.values(obj).join());

        const values = title + ',' + description.split(" ").join() + ',' + ',' + extractedValues.join() + ',';

        const valuesReplaced = values.replace(/[^a-zA-Z0-9,]/g, "");
        const finish = valuesReplaced.split(/[ ,]+/);

        tags.push(...finish);


        return dataRouter.create({ price: priceParsed, props: props, title: title, description: description, soldBy: ObjectId(soldBy.toString()), tags: tags, inventories: inventories, img: images, reference: reference, currency: currency, collectionName: collection })
            .then(item => {
                return Stores.findById(soldBy.toString())
                    .then(store => {

                        const storeId = store.owner

                        return Users.findById(storeId)
                            .then(user => {
                                return UserItems.findOne({ userId: user._id })
                                    .then(userItem => {
                                        if (!userItem) {
                                            UserItems.create({ userId: user._id, items: [{ storeId: store._id, items: [{ itemId: item._id, collection: collection, name: item.title }] }] })
                                        } else {
                                            for (let i = 0; i <= userItem.items.length; i++) {
                                                if (userItem.items.length !== 0) {
                                                    if (userItem.items[i].storeId.toString() === soldBy) {
                                                        userItem.items[i].items.push({ itemId: item._id.toString(), collection: collection, name: item.title })
                                                        return UserItems.findByIdAndUpdate({ _id: userItem._id }, { items: userItem.items})
                                                        .then(() => {
                                                            const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                                                            return token
                                                        }) 
                                                    }
                                                } else {
                                                    userItem.items.push({ storeId: store._id, items: [{ itemId: item._id.toString(), collection: collection, name: item.title }] })
                                                    UserItems.findByIdAndUpdate({ _id: userItem._id }, { items: userItem.items})
                                                    .then(() => {
                                                        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                                                        return token
                                                    })
                                                }
                                            }
                                        }
                                        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                                        return token
                                    })
                            })
                    })
            })
    } catch (error) {
        log('ERROR', 'addFurniture -> 7 ', error)
        throw new UnexpectedError(error)
    }
}
module.exports = addFurniture