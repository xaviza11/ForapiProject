const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users, Codes, UserItems, Basket } = require('../models')
const { hash } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')

/**
 * @use This logic is used for register a new user @use
 * @param {string} name The name of the user
 * @param {string} email The email of the user
 * @param {string} password The password of the user
 * @param {string} storeCode This is a code for register stores 
 * @param {number} phone This is a number of phone
 * @param {number} secretPass The pass for validate client
 */

function registerUser(name, email, password, storeCode, phone, secretPass) {

    log('INIT', 'registerUser -->  ', 'WORK')

    try {
        if (typeof secretPass !== 'number') throw new TypeError(selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator('thisIsRegister', email, secretPass)
        //if (isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
        if (typeof storeCode !== 'string') throw new TypeError(selectedLanguage.codeNotString)
        if (typeof name !== 'string') throw new TypeError(selectedLanguage.nameNotString)
        if (typeof email !== 'string') throw new TypeError(selectedLanguage.emailNotString)
        if (typeof password !== 'string') throw new TypeError(selectedLanguage.passwordNotString)
        if (typeof phone !== 'string') throw new TypeError(selectedLanguage.phoneNotString)
    } catch (error) {
        log('ERROR', 'registerUser --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (name < 1) throw new LengthError(selectedLanguage.nameEmpty)
        if (password < 8) throw new LengthError(selectedLanguage.passwordEmpty)
        if (!phone) throw new LengthError(selectedLanguage.passwordBadLength)
    } catch (error) {
        log('ERROR', 'registerUser --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        if (HAS_SPACES_REGEX.test(password)) throw new FormatError(selectedLanguage.passwordHasSpaces)
        if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(selectedLanguage.emailNotValid)
    } catch (error) {
        log('ERROR', 'registerUser --> 3 ', error)
        throw new FormatError(error)
    }

    try {
        if (storeCode !== 'none') {
            return Codes.findOne({ email: email })
                .then(code => {
                    if (!code) {
                        log('ERROR', 'registerUser --> 3 ', 'not code')
                        throw new NotFoundError(selectedLanguage.codeEmpty)
                    }
                    if (code._doc.code === storeCode && code._doc.email === email && code._doc.codeType === 'Register') {
                        return Codes.deleteOne({ email: email })
                            .then(() => {
                                const g = code._doc.userType
                                return hash(password, 8)
                                    .then(hash => Users.create({ name, email, password: hash, gender: g, phone: phone, date: new Date() })
                                        .then(user => {
                                            UserItems.create({ userId: user._id })
                                                .then(async userItem => {
                                                    user.itemsList = userItem._id
                                                    await user.save()
                                                    return {status: 'done'}
                                                })
                                        })
                                        .catch(error => {
                                            if (error.message.includes('E11000')) {
                                                log('ERROR', 'registerUser --> 3 ', selectedLanguage.userAlreadyExist)
                                                throw new ConflictError(selectedLanguage.userAlreadyExist)
                                            }
                                            log('ERROR', 'registerUser --> 4 ', error.message)
                                            throw new UnexpectedError(error.message)
                                        })
                                    )
                            })
                    } else {
                        log('ERROR', 'registerUser --> 5 ', 'error on typeCode')
                        throw new UnexpectedError('error on typeCode')
                    }
                })
        } else {
            if (!storeCode) {
                log('ERROR', 'registerUser --> 6 ', 'not code')
                throw new NotFoundError(selectedLanguage.codeEmpty)
            }
            const g = 'Personal'
            return hash(password, 8)
                .then(hash => {
                    return Users.create({ name, email, password: hash, gender: g, phone: phone, date: new Date() })
                        .then(user => {
                            return Basket.create({ userId: user._id, items: [] })
                                .then((basket) => {
                                    user.basketId = basket._id
                                    user.save()
                                    return {status: 'done'}
                                })

                        })
                        .catch(error => {
                            if (error.message.includes('E11000')) {
                                log('ERROR', 'registerUser --> 7 ', selectedLanguage.userAlreadyExist)
                                throw new ConflictError(selectedLanguage.userAlreadyExist)
                            }

                            log('ERROR', 'registerUser --> 8 ', error.message)
                            throw new UnexpectedError(error.message)
                        })
                }
                )
        }
    } catch (error) {
        log('ERROR', 'registerUser --> 9 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = registerUser