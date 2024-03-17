const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
  } = require('com')
  const { Users } = require('../models')
  const { routerInfo, routerDatas, routerStores } = require('../utils/routuerCollections')
  const { compare } = require('bcryptjs')
  const { hash } = require('bcryptjs')
const {  } = require('com/errors')
const selectedLanguage = require('../utils/languages/es.json')  
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const jwt = require('jsonwebtoken')

  /**
   * @use This logic is used for delete one item @use
   * 
   * @param {string} id The id of the furniture for delete
   * @param {string} collection The collection of the item
   * @param {number} secretPass The password for validate client
   * @param {string} token The token of the user
   */
  
  function deleteItem(id, collection, secretPass, token) {

    log('INIT', 'deleteItem -->' , 'WORK')
      
    try{
      if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
      if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
      //const isSecretPassValid = passwordValidator(token, null, secretPass)
      //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
      if (typeof id !== 'string') throw new TypeError( selectedLanguage.idNotString)
      if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
      if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
      if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
  }catch(error) { 
    log('ERROR', 'deleteItem --> 1 ', error)
    throw new TypeError(error) }

  try{
    if (!id.length) throw new LengthError( selectedLanguage.idEmpty)
    if (!collection.length)throw new LengthError( selectedLanguage.collectionEmpty)
    if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
  }catch(error) {
    log('ERROR', 'deleteItem --> 2 ', error)
    throw new LengthError(error)}

    try{

      const decodedToken = jwt.decode(token, JWT_SECRET);
      const userId = decodedToken.sub
  
      const dataRouter = routerDatas(collection)

        return dataRouter.findByIdAndDelete({_id: id})
        .then(() => {
          return Users.findById(userId)
          .then(user => {
            const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
            return token
          })
        })
    }catch(error) { 
      log('ERROR', 'deleteItem --> 5 ', error)
      throw new UnexpectedError(error) }
  }

  module.exports = deleteItem