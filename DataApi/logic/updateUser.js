const {
  errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
  regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users } = require('../models')
const { compare } = require('bcryptjs')
const { hash } = require('bcryptjs')
const { } = require('com/errors')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const jwt = require('jsonwebtoken')

    /**
     * @use This logic is used to update user information @use
     * @param {string} token The token of the user
     * @param {string} password The current password of the user
     * @param {string} newEmail The new email to update
     * @param {string} newPassword The new password to update
     * @param {string} newName The new name to update
     * @param {string} newPhone The new phone number to update
     * @param {number} secretPass The pass for validating the client
     */

function updateUser(token, password, newEmail, newPassword, newName, newPhone, secretPass) {

  log('INIT', 'updateUser -->', 'WORK')

  try {
    if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
    if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)

    //const isSecretPassValid = passwordValidator(token, null, secretPass)
    //if (isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)

    if (typeof password !== 'string') throw new TypeError( selectedLanguage.passwordNotString)
  } catch (error) {
    log('ERROR', 'updateUser --> 1 ', error)
    throw new TypeError(error)
  }

  try {
    if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
  } catch (error) {
    log('ERROR', 'updateUser --> 2 ', error)
    throw new LengthError(error)
  }

  try {

    const decodedToken = jwt.decode(token, JWT_SECRET);
    const userId = decodedToken.sub

    return Users.findById(userId)
      .then(user => {
        if (!user) throw new NotFoundError(selectedLanguage.user + selectedLanguage.notExist)
        let updateEmail
        let updateName
        let updatePhone
        let updatePassword
        if (!newEmail) updateEmail = user.email
        else updateEmail = newEmail
        if (!newName) updateName = user.name
        else updateName = newName
        if (!newPhone) updatePhone = user.phone
        else updatePhone = newPhone
        if (!newPassword) updatePassword = password
        else updatePassword = newPassword
        return compare(password, user.password)
          .then(match => {
            if (!match) {
              log('ERROR', 'updateUser --> 4 ', selectedLanguage.wrongPassword)
              throw new AuthError(selectedLanguage.wrongPassword)
            }
            if (match) {
              return hash(updatePassword, 8)
                .then(hash => {
                  log('SUCCESS', 'updateUser --> ', 'SUCCESS')
                  return Users.findByIdAndUpdate(userId, { name: updateName, email: updateEmail, password: hash, phone: updatePhone })
                    .then(user => {
                      const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                      return token
                    })
                })
            }
          })
      })
  } catch (error) {
    log('ERROR', 'updateUser --> 5 ', error)
    throw new UnexpectedError(error)
  }
}

module.exports = updateUser