const {
  errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
  regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users, UserItems } = require('../models')
const { routerInfo, routerDatas, routerStores } = require('../utils/routuerCollections')
const { compare } = require('bcryptjs')
const { hash } = require('bcryptjs')
const { } = require('com/errors')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const jwt = require('jsonwebtoken')

/**
 * @use This logic is used for update one item @use
 * @param {string}  id The id of the item
 * @param {string} title The new title of the item
 * @param {string} description The new description
 * @param {number} price The new price
 * @param {string} collection The collection of the item
 * @param {string} itemList The id of the itemList
 * @param {number} secretPass The secretPass for validate the number
 * @param {string} token The token of the user
 */

async function updateItem(id, title, description, price, collection, itemList, secretPass, token) {

  log('INIT', 'updateItem -->', 'WORK')

  try {
    if(typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
    //const isSecretPassValid = passwordValidator(token, null, secretPass)
    //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
    if (typeof id !== 'string') throw new TypeError( selectedLanguage.idNotString)
    if (typeof title !== 'string') if (!title.length) throw new TypeError( selectedLanguage.titleNotString)
    if (typeof description !== 'string') if (!description.length) throw new TypeError( selectedLanguage.descriptionNotString)
    if (typeof price !== 'number') if (price !== null) throw new TypeError( selectedLanguage.priceParsedNotNumber)
    if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
    if (typeof itemList !== 'string') throw new TypeError( selectedLanguage.idNotString)
  } catch (error) {
    log('ERROR', 'updateItem --> 1 ', error)
    throw new TypeError(error)
  }

  try {
    if (!id.length) throw new LengthError( selectedLanguage.idEmpty)
    if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    if (!itemList.length) throw new LengthError( selectedLanguage.itemNotString)
  } catch (error) {
    log('ERROR', 'updateItem --> 2 ', error)
    throw new LengthError(error)
  }

  try {
    const dataRouter = routerDatas(collection);
    const data = await dataRouter.findById({ _id: id });

    if (!title.length) title = data.title;
    if (!description.length) description = data.description;
    if (price === null) price = data.price;

    await dataRouter.findByIdAndUpdate({ _id: id }, { title, description, price });

    const result = await UserItems.findById({ _id: itemList });

    for (let j = 0; j < result.items.length; j++) {
      if (result.items[j].storeId.toString() === data.soldBy.toString()) {
        for (let i = 0; i < result.items[j].items.length; i++) {
          if (result.items[j].items[i].itemId === id) {
            const toUpdate = result;
            toUpdate.items[j].items[i].name = title;

            const decodedToken = jwt.decode(token, JWT_SECRET);

            await UserItems.findByIdAndUpdate({ _id: itemList }, toUpdate);

            const user = await Users.findById(decodedToken.sub);
            const itemsList = await UserItems.findById(user.itemsList);

            for (let i = 0; i < itemsList.items.length; i++) {
              if (data.soldBy.toString() === itemsList.items[i].storeId.toString()) {
                for (let j = 0; j < itemsList.items[i].items.length; j++) {
                  if (itemsList.items[i].items[j].itemId === data._id.toString()) {
                    itemsList.items[i].items[j].name = title;
                    await itemsList.save();
                    const newToken = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
                    return { token: newToken, name: title };
                  }
                }
              }
            }
          }
        }
      }
    }
    return null;
  } catch (error) {
    log('ERROR', 'updateItem --> 5 ', error);
    throw new UnexpectedError(error);
  }
}

module.exports = updateItem