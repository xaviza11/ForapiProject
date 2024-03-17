const {
  errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
  regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users } = require('../models')
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
 * @use This logic is used for update the images of one item @use
 * @param {string} id The id of the item
 * @param {array} images The images of the item
 * @param {string} collection The colleciton og the item
 * @param {number} secretPass The pass for validate the client
 * @param {string} token The token of the user
 */

function updateImg(id, images, collection, secretPass, token) {

  log('INIT', 'updateImg -->', 'WORK')

  try {
    if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
    //const isSecretPassValid = passwordValidator(token, null, secretPass)
    //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
    if (typeof id !== 'string') throw new TypeError( selectedLanguage.idNotString)
    if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
    if (!(Array.isArray(images))) throw new TypeError( selectedLanguage.imgNotArray)
  } catch (error) {
    log('ERROR', 'updateImg --> 1 ', error)
    throw new TypeError(error)
  }

  try {
    if (!id.length) throw new LengthError( selectedLanguage.idEmpty)
    if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
  } catch (error) {
    log('ERROR', 'updateImg --> 2 ', error)
    throw new LengthError(error)
  }

  try {

    const decodedToken = jwt.decode(token, JWT_SECRET);
    const userId = decodedToken.sub
  
    const dataRouter = routerDatas(collection)

    return dataRouter.findByIdAndUpdate({ _id: id }, { img: images })
      .then(() => {
        return Users.findById(userId)
          .then(user => {
            const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
            return token
          })
      })
  } catch (error) {
    log('ERROR', 'updateImg --> 5 ', error)
    throw new UnexpectedError(error)
  }
}

module.exports = updateImg