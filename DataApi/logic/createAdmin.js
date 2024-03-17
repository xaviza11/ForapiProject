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
 * @use This logic create new admin user if don't exist one previus admin item @use
 */

function createAdmin() {

    log('INIT', 'createAdmin -->  ', 'WORK')
    try {
        return hash('forapiAdmin4682@', 8)
            .then(hash => {
                return Users.findOne({ gender: 'adm' })
                    .then(user => {
                        if (user === null) {
                            return Users.create({ name: '01', email: '01_0001@0001.com', password: hash, gender: 'adm', phone: '123123123', stores: [], date: new Date(), isBanned: false, strikes: 0 })
                                .then(created => {
                                    return selectedLanguage.userCreated
                                })
                        } else {
                            return selectedLanguage.adminAlreadyExists
                        }
                    })
            })
    } catch (error) {
        log('ERROR', 'createAdmin --> 9 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = createAdmin