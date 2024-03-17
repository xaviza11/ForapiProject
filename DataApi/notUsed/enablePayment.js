const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')

/**
 * This logic is used for enable the payment //!This isn't used actually because the build logics needs to be made
 * @param {string}  orderId The id of the order
 * @param {string} userId The id of the user 
 */

function enablePayment(orderId, userId) {

    log('INIT', 'enablePayment --> ', 'WORK')

    /*try {
        if (typeof userId !== 'string') throw new TypeError('type:' + selectedLanguage.articleMale + selectedLanguage.user + selectedLanguage.notString)
        if (typeof orderId !== 'string') throw new TypeError('type: orderId' + selectedLanguage.notString)
    } catch (error) {
        log('ERROR', 'enablePayment --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!orderId.length) throw new LengthError(selectedLanguage.empty)
        if (!userId.length) throw new LengthError(selectedLanguage.empty)
    } catch (error) {
        log('ERROR', 'enablePayment --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        return Users.findById({ _id: userId })
            .then(user => {
                if (!user) {
                    log('ERROR', 'enablePayment --> 3 ', selectedLanguage.user + selectedLanguage.empty)
                    throw new NotFoundError(selectedLanguage.user + selectedLanguage.empty)
            } 
                if (user.gender === 'Store') {
                    return FurnitureOrders.findById({ _id: orderId })
                        .then(A => {
                            if (!A){
                                log('ERROR', 'enablePayment --> 4 ', 'notOrder')
                                throw new NotFoundError('not order')
                            } 
                            log('SUCCESS', 'enablePayment -->  ', 'SUCCESS')
                            if (A.isReady === false) return FurnitureOrders.findOneAndUpdate({ _id: orderId }, { isReady: true })
                            if (A.isReady === true) return FurnitureOrders.findOneAndUpdate({ _id: orderId }, { isReady: false })
                        })
                } else{
                    log('ERROR', 'enablePayment --> 5 ', 'user not store')
                    throw new FormatError('user is not store')
                }
            })
    } catch (error) { 
        log('ERROR', 'enablePayment --> 6 ', error)
        throw new UnexpectedError(error) }*/
}

module.exports = enablePayment

/**/