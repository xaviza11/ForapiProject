const { errors: { FormatError, NotFoundError, LengthError, UnexpectedError } } = require('com')
const { Users, Stores, FornituresOfOwners } = require('../models')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')

/**
 * This logic retrieve the furniture of the user.
 * @param {string}  userId The id of the user
 */

function retrieveOwnerFurniture(userId) {

    log('INIT', 'retrieveOwnerFurniture -->  ', 'WORK')

    try {
        if (typeof userId !== 'string') throw new TypeError('type:' + selectedLanguage.articleMale + selectedLanguage.user + selectedLanguage.notString)
    } catch (error) { 
        log('ERROR', 'retrieveOwnerFurniture --> 1 ', error)
        throw new TypeError(error) }

    try {
        if (!userId) throw new LengthError(selectedLanguage.articleMale + selectedLanguage.user + selectedLanguage.notLength)
    } catch (error) {
        log('ERROR', 'retrieveOwnerFurniture --> 2 ', error)
        throw new LengthError(error) }

    try {
        return FurnitureOfOwners.find({ owner: userId })
            .then(data => {
                if (!data){
                    log('ERROR', 'retrieveOwnerFurniture --> 3 ', error)
                    throw new NotFoundError(selectedLanguage.notExist)
                } 
                log('SUCCESS', 'retrieveOwnerFurniture --> ', 'SUCCESS')
                return { data }
            })
    } catch (error) { 
        log('ERROR', 'retrieveOwnerFurniture --> 4 ', error)
        throw new UnexpectedError(error) }
}

module.exports = retrieveOwnerFurniture