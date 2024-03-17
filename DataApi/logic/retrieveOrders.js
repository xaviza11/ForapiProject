const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users, Chats, } = require('../models')
const { stores } = require('../models/schemas')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This logic retrieve the orders of the user @use
 * @param {string}  token The id of the user
 */

function retrieveOrders(token) {

    log('INIT', 'retrieveOrders --> ', 'WORK')

    try {
        if (typeof token !== 'string') throw new TypeError('type: userId ' + selectedLanguage.empty)
    } catch (error) {
        log('ERROR', 'retrieveOrders --> 1 ', error)
        throw new TypeError(error) }

    try{
        if (!token.length) throw new LengthError(selectedLanguage.articleMale + selectedLanguage.user + selectedLanguage.notLength)
    }catch(error) {
        log('ERROR', 'retrieveOrders --> 2 ', error)
        throw new LengthError(error)}

    try {

        const decodedToken = jwt.decode(token, JWT_SECRET);
        let userId = decodedToken.sub

        return Users.findById({ _id: userId })
            .then(user => {
                if(!user){
                    log('ERROR', 'retrieveOrders --> 3 ', selectedLanguage.articleMale + selectedLanguage.user + selectedLanguage.empty)
                    throw new NotFoundError(selectedLanguage.articleMale + selectedLanguage.user + selectedLanguage.empty)
                } 
                if (user.gender === 'Personal') {
                    return Chats.find({ client: userId })
                        .then(orders => {
                            if (!orders.length){
                                log('ERROR', 'retrieveOrders --> 4 ', selectedLanguage.articlesFemales + selectedLanguage.orders + selectedLanguage.empty)
                                throw new TypeError(selectedLanguage.articlesFemales + selectedLanguage.orders + selectedLanguage.empty)
                            } 
                            const ids = []
                            for (let i = orders.length - 1; i >= 0; i--) {
                                ids.push(orders[i].store.toString())
                            }
                            return Stores.find({ _id: { $in: ids } })
                                .then(stores => {
                                    if(!stores){
                                        log('ERROR', 'retrieveOrders --> 5 ',selectedLanguage.articlesFemales + selectedLanguage.store + selectedLanguage.empty)
                                        throw new NotFoundError(selectedLanguage.articlesFemales + selectedLanguage.store + selectedLanguage.empty)
                                    } 
                                    for (let i = orders.length - 1; i >= 0; i--) {
                                        for (let j = stores.length - 1; j >= 0; j--) {
                                            if (orders[i].store.toString() === stores[j]._id.toString() || stores[j].owner.toString() === userId) {
                                                delete orders[i]._doc.client
                                                delete orders[i]._doc.store
                                                delete orders[i]._doc.owner
                                                orders[i]._doc.storeArray.push(stores[j]._doc.name)
                                                orders[i]._doc.storeArray.push(stores[j].phone)
                                                orders[i]._doc.storeArray.push(stores[j].email)
                                                orders[i]._doc.storeArray.push(stores[j].webSide)
                                                orders[i]._doc.storeArray.push(stores[j].country)
                                                orders[i]._doc.storeArray.push(stores[j].city)
                                            }
                                        }
                                    }
                                    orders.reverse()
                                    return { orders: orders }
                                })
                        })
                } else if (user.gender === 'Store') {
                    return Chats.find({ owner: userId })
                        .then(orders => {
                            if (!orders.length){
                                log('ERROR', 'retrieveOrders --> 6 ', selectedLanguage.orders + selectedLanguage.empty)
                                throw new NotFoundError(selectedLanguage.orders + selectedLanguage.empty)
                            } 
                            const ids = []
                            for (let i = orders.length - 1; i >= 0; i--) {
                                ids.push(orders[i].store.toString())
                            }
                            return Stores.find({ _id: { $in: ids } })
                                .then(stores => {
                                    if (!stores.length){
                                        log('ERROR', 'retrieveOrders --> 7 ',selectedLanguage.articlesFemales + selectedLanguage.stores + selectedLanguage.notLength)
                                    throw new NotFoundError(selectedLanguage.articlesFemales + selectedLanguage.stores + selectedLanguage.notLength)
                                }
                                    for (let i = orders.length - 1; i >= 0; i--) {
                                        for (let j = stores.length - 1; j >= 0; j--) {
                                            if (orders[i].store.toString() === stores[j]._id.toString() || stores[j].owner.toString() === userId) {
                                                delete orders[i]._doc.client
                                                delete orders[i]._doc.store
                                                delete orders[i]._doc.owner
                                                orders[i]._doc.storeArray.push(stores[j]._doc.name)
                                                orders[i]._doc.storeArray.push(stores[j].phone)
                                                orders[i]._doc.storeArray.push(stores[j].email)
                                                orders[i]._doc.storeArray.push(stores[j].webSide)
                                                orders[i]._doc.storeArray.push(stores[j].country)
                                                orders[i]._doc.storeArray.push(stores[j].city)
                                            }
                                        }
                                    }
                                    orders.reverse()
                                    log('SUCCESS', 'retrieveOrders --> ', 'SUCCESS')
                                    return { orders: orders }
                                })
                        })
                }
            })
    } catch (error) { 
        log('ERROR', 'retrieveOrders --> 8 ', error)
        throw new UnexpectedError(error) }
}

module.exports = retrieveOrders