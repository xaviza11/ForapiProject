const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX, HAS_NO_SYMBOLS_REGEX }
} = require('com')
const { Basket, Stores, Users } = require('../models')
const { hash } = require('bcryptjs')
const { routerDatas } = require('../utils/routuerCollections')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env


/**
* @use This logic retrieve the cbasketId of the user @use
* @param {string} id The id of the basket
* @param {string} token The token of the user
* @param {number} secretPass One pass for validate the client
*/

function retrieveBasketItems(id, token, secretPass) {

    log('INIT', 'retrieveBasketItems -->  ', 'WORK')

    try {
        if (typeof id !== 'string') throw new TypeError(selectedLanguage.idNotString)
        if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw TypeError(selectedLanguage.secretPassNotValid)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.secretPassNotValid)
    } catch (error) {
        log('ERROR', 'retrieveBasketItems --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!id.length) throw new LengthError(selectedLanguage.idEmpty)
        if (!token.length) throw new LengthError(selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'retrieveBasketItems --> 1 ', error)
        throw new LengthError(error)
    }

    return Basket.findById(id)
        .then(basket => {

            const promises = [];

            for (let i = 0; i < basket.items.length; i++) {
                const itemId = basket.items[i].id;
                const itemCollection = basket.items[i].collection;
                const dataRouter = routerDatas(itemCollection);

                const itemPromise = dataRouter.findById(itemId)
                    .then(item => {

                        const storeId = item.soldBy.toString()

                        return Stores.findById(storeId)
                            .then(store => {
                                const storeName = store.name

                                const userId = store.owner.toString()

                                return Users.findById(userId)
                                    .then(user => {

                                        const price = item.price;
                                        const title = item.title;
                                        const currency = item.currency
                                        const description = item.description;
                                        const soldBy = item.soldBy

                                        return {
                                            _id: item._id,
                                            price: price,
                                            title: title,
                                            currency: currency,
                                            description: description,
                                            soldBy: soldBy,
                                            storeName: storeName,
                                            storeImage: user.image,
                                            quantity: basket.items[i].quantity,
                                            collection: basket.items[i].collection,
                                            phone: user.phone
                                        };
                                    })
                            })
                    });

                promises.push(itemPromise);
            }
            return Promise.all(promises)
        })
        .then(result => {

            const decodedToken = jwt.decode(token, JWT_SECRET);
            const userId = decodedToken.sub

            const newToken = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
            return { items: result, token: newToken }
        });
}

module.exports = retrieveBasketItems