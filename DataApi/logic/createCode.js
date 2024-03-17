const {
  errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
  regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { Users, Codes } = require('../models')
const { compare } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env

/**
 * @use This logic create new code for register stores @use //? In the future maybe can add other kinds of codes
 * @param {string} token The token of the user
 * @param {string} email The email of the store
 * @param {string} type The type of code
 * @param {string} userType The type of user
 * @param {number} secretPass The secretPass of the user
 */

function createCode(token, email, type, userType, secretPass) {


  const decodedToken = jwt.decode(token, JWT_SECRET);
  const ownerEmail = decodedToken.sub

  log('INIT', 'createCode --->', 'WORK')

  try {
    if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
    if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
    //const isSecretPassValid = passwordValidator(token, null, secretPass)
    //if(isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
    if (typeof ownerEmail !== 'string') throw new TypeError( selectedLanguage.ownerEmailNotString)
    if (typeof email !== 'string') throw new TypeError( selectedLanguage.emailNotString)
    if (typeof type !== 'string') throw new TypeError( selectedLanguage.typeNotString)
    if (typeof userType !== 'string') throw new TypeError( selectedLanguage.userTypeEmpty)
  } catch (error) {
    log('ERROR', 'createCode ---> 1 ', error)
    throw new TypeError(error)
  }

  try {
    if (!token) throw new LengthError( selectedLanguage.tokenEmpty)
    if (!email) throw new LengthError( selectedLanguage.emailEmpty)
    if (!ownerEmail) throw new LengthError( selectedLanguage.ownerEmailEmpty)
    if (!type) throw new LengthError( selectedLanguage.typeEmpty)
    if (!userType.length) throw new LengthError( selectedLanguage.userTypeEmpty)
  } catch (error) {
    log('ERROR', 'createCode ---> 2 ', error)
    throw new LengthError(error)
  }

  try {
    if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(selectedLanguage.emailNotValid)
  } catch (error) {
    log('ERROR', 'createCode ---> 3 ', error)
    throw new FormatError(error)
  }

  try {
    return Users.findById(ownerEmail)
      .then(user => {
        if (!user) {
          log('ERROR', 'createCode ---> 4 ', 'not user')
          throw new NotFoundError(selectedLanguage.userNotExist)
        }
        if (user.gender === 'adm') {
          // if (RA === number && RB === numberB && RC === numberC) {
          let code = "";
          function generateCode(length) {
            let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
              let index = Math.floor(Math.random() * characters.length);
              code += characters.charAt(index);
            }
          }
          generateCode(12);
          return Codes.create({ email: email, codeType: type, code: code, userType: userType, date: new Date() })
            .then(res => {
              const token = jwt.sign({sub: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})
              const response = {res: res, token: token}
              return response
            })
        }else throw new UnexpectedError(selectedLanguage.userNotAdmin)
      })
  } catch (error) {
    log('ERROR', 'createCode ---> 5 ', error)
    throw new UnexpectedError(error)
  }
}


module.exports = createCode