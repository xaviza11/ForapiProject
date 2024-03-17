const {
    errors: { FormatError, LengthError, NotFoundError, AuthError, UnexpectedError},
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX }
} = require('com')
const { Users, Tags } = require('../models')
const { compare } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const {routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch} = require('../utils/routuerCollections')

/**
 * @use This logic is used for download the data of the searches, next to do it delete the data @use
 * @param {string}  id The id of the furniture
 * @param {string} collection The collection of the items
 */

function downloadSearches(email, pass, number, numberB, numberC, collection) {

    log('INIT', 'downloadSearches -->  ', 'INIT')

    try {
        try {
            if (typeof email !== 'string') throw new TypeError( selectedLanguage.emailNotString)
            if (typeof pass !== 'string') throw new TypeError( selectedLanguage.passwordNotValid)
            if (typeof number !== 'number') throw new TypeError('type: number is not number')
            if (typeof numberB !== 'number') throw new TypeError('type: numberB is not number')
            if (typeof numberC !== 'number') throw new TypeError('type: numberC is not number')
        } catch (error) { 
            log('ERROR', 'downloadSearches --> 1 ', error)
            throw new TypeError(error) }

        try{
        if (!pass.length) throw new LengthError( selectedLanguage.passwordEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
        }catch (error) {
            log('ERROR', 'downloadSearches --> 2 ', error)
            throw new LengthError(error)}

        try {
            if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(selectedLanguage.emailNotValid)

        } catch (error) {
            log('ERROR', 'downloadSearches --> 3 ', error)
            throw new FormatError(error) }

        const i = new Date()
        const h = i.getHours() + 1
        const d = i.getDate()
        const m = i.getMonth() + 1
        const y = i.getFullYear()

        const f = d * m * y

        const resA = f * 3.14 * 11 / 0.33 / 100 / h
        const resB = f * 73 / 0.45323 * h / 2
        const resC = h + 1 * f * 2 / 6.67 + 11

        const RA = Math.floor(resA)
        const RB = Math.floor(resB)
        const RC = Math.floor(resC)

        const searchRouter = routerSearch(collection)

        return Users.findOne({ email: email })
            .then(user => {
                if(!user){
                    log('ERROR', 'downloadSearches --> 4 ', (selectedLanguage.userNotExist))
                    throw new NotFoundError(selectedLanguage.userNotExist)
                }
                if (user.gender === 'Worker') {
                    // if (RA === number && RB === numberB && RC === numberC) {
                    return searchRouter.find({}).select('-owner').lean()
                        .then(data => {
                            return Tags.find({})
                                .then(dataB => {
                                    if(!dataB){
                                        log('ERROR', 'downloadSearches --> 5 ', (selectedLanguage.tagsEmpty))
                                        throw new NotFoundError(selectedLanguage.tagsEmpty)
                                    }
                                    function awt() {
                                        if (data && dataB) console.log('yes')
                                        else {
                                            awt()
                                        }
                                    }
                                    const done = data
                                    const doneB = dataB
                                    awt()
                                    return searchRouter.deleteMany({})
                                        .then(() => {
                                            return Tags.deleteMany({})
                                                .then(() => {
                                                    log('SUCCESS', 'downloadSearches --> ', 'SUCCESS')
                                                    return { done, doneB }
                                                })
                                        })
                                })
                        })
                } else {
                    log('ERROR', 'downloadSearches --> 6 ', 'fatal error inside logic')
                     throw new UnexpectedError('fatal error')
                }
            })
    } catch (error) { 
        log('ERROR', 'downloadSearches --> 7 ', error)
        throw new UnexpectedError(error) }
}

module.exports = downloadSearches