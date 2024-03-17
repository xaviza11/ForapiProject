const {
  errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError },
  regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { Users } = require('../models')
const { compare } = require('bcryptjs')
const { ObjectId } = require('mongodb');
const { furnitureInfo: furnitureInfo } = require('../models/schemas');
const { hash } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const nodemailer = require('nodemailer')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')
const { SERVICE, EMAIL, PASS } = process.env


/**
 * @use This logic is used for recovery one account @use
 * @param {String} email The email for recovery
 * @param {number} secretPass The secret pass for validate client
 */

function recoveryAccount(email, secretPass) {

  log('INIT', 'recoveryAccount -->  ', 'WORK')

  try {
    if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
    //const isSecretPassValid = passwordValidator('thisIsRecoveryPass', email, secretPass)
    //if(isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
    if (typeof email !== 'string') throw new TypeError( selectedLanguage.emailNotString)
  } catch (error) {
    log('ERROR', 'recoveryAccount --> 1 ', error)
    throw new TypeError(error)
  }

  try {
    if (!email.length) throw new LengthError( selectedLanguage.emailEmpty)
  } catch (error) {
    log('ERROR', 'recoveryAccount --> 2 ', error)
    throw new LengthError(error)
  }

  try {
    if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(selectedLanguage.emailNotValid)
  } catch (error) {
    log('ERROR', 'recoveryAccount --> 3 ', error)
    throw new FormatError(error)
  }

  try {

    function generatePassword(length) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
      }

      return password;
    }

    const randomPassword = generatePassword(12);

    return Users.findOne({ email: email })
      .then(user => {
        if (!user) {
          log('ERROR', 'recoveryAccount --> 3 ', selectedLanguage.userNotExist)
          throw new NotFoundError(selectedLanguage.userNotExist)
        }
        const transporter = nodemailer.createTransport({
          service: SERVICE,
          auth: {
            user: EMAIL,
            pass: PASS
          }
        });

        const mailOptions = {
          from: EMAIL,
          to: email,
          subject: selectedLanguage.recoveryPasswordTitle,
          text: selectedLanguage.dear + user.email + selectedLanguage.recoveryPasswordText + randomPassword + selectedLanguage.recoveryPasswordTextB
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending gmail ' + error);
          } else {
            console.log('Email is sended: ' + info.response);
          }
        });

        return hash(randomPassword, 8)
          .then(hash => {
            log('SUCCESS', 'recoveryAccount -->  ', 'SUCCESS')
            return Users.findOneAndUpdate({ _id: user._id }, { name: user.name, email: user.email, password: hash, phone: user.phone })
          })
      })
  } catch (error) {
    log('ERROR', 'recoveryAccount --> 4 ', error)
    throw new UnexpectedError(error)
  }
}
module.exports = recoveryAccount