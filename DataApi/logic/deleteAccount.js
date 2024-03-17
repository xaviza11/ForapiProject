const {
  errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
  regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX },
  error
} = require('com')
const { Users } = require('../models')
const { compare } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')

/**
 * @use This logic is used for delete the account of the user @use
 * @param {string} password The password for secure the delete 
 * @param {string} token The token of the user
 * @param {number} secretPass One password for validate the client
 */

function deleteAccount(token, password, secretPass) {

  log('INIT', 'deleteAccount --> ', 'WORK')

  try {
    if (typeof secretPass !== 'number') throw new TypeError(selectedLanguage.secretPassNotValid) 
    if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
    //const isSecretPassValid = passwordValidator(token, null, secretPass)
    //if(isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
    if (typeof password !== 'string') throw new TypeError(selectedLanguage.passwordNotString)
  } catch (error) {
    log('ERROR', 'deleteAccount --> 1 ', error)
    throw new TypeError(error)
  }

  try {
    if (password.length < 8) throw new LengthError(selectedLanguage.passwordNotValid)
    if (!token.length) throw new LengthError(selectedLanguage.tokenEmpty)
  } catch (error) {
    log('ERROR', 'deleteAccount --> 2 ', error)
    throw new LengthError(error)
  }

  try {
    if (HAS_SPACES_REGEX.test(password)) throw new FormatError('format:' + selectedLanguage.passwordHasSpaces)
  } catch (error) {
    log('ERROR', 'deleteAccount --> 3 ', error)
    throw new FormatError(error)
  }

  try {

    const decodedToken = jwt.decode(token, JWT_SECRET);
    const userId = decodedToken.sub

    return Users.findById(userId)
      .then(user => {
        if (user) {
          return compare(password, user.password)
            .then(match => {
              if (!match) {
                log('ERROR', 'deleteAccount --> 4', selectedLanguage.wrongPassword)
                throw new AuthError(selectedLanguage.wrongPassword)
              }
              log('SUCCESS', 'deleteAccount --> ', 'SUCCESS')
              if (match) return Users.deleteOne({ _id: userId })
            })
        } else {
          log('ERROR', 'deleteAccount --> 5 ', error)
          throw new NotFoundError(error)
        }
      })
  } catch (error) {
    log('ERROR', 'deleteAccount --> 6 ', error)
    throw new UnexpectedError(error)
  }
}

module.exports = deleteAccount