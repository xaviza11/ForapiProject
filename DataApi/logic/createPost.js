const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX }
} = require('com')
const { Users, Posts } = require('../models')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')

/**
 * @use This logic create a new post @use
 * @param {string} userId The userId for create the post
 * @param {string} comment The comment of the post
 * @param {String} furnitureId The furniture id for input reference
 */

function createPost(userId, comment, furnitureId) {

    log('INIT', 'ceatePost --> ', 'WORK')

    try {
        if (typeof userId !== 'string') throw new TypeError( selectedLanguage.userNotString)
        if (typeof comment !== 'string') throw new TypeError( selectedLanguage.commentNotString)
        if (typeof furnitureId !== 'string') throw new TypeError( selectedLanguage.furnitureNotString)
    } catch (error) {
        log('ERROR', 'createPost --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!userId.length) throw new LengthError( selectedLanguage.userEmpty)
        if (!comment.length) throw new LengthError( selectedLanguage.commentEmpty)
        if (!furnitureId.length) throw new LengthError( selectedLanguage.furnitureEmpty)
    } catch (error) {
        log('ERROR', 'createPost --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        return Users.findById({ _id: userId })
            .then(user => {
                if (!user) {
                    log('ERROR', 'createPost --> 3 ', error)
                    throw new NotFoundError('not user')
                }
                return Posts.create({ userName: user.name, comment: comment, furnitureId: furnitureId, date: new Date() })
                    .then(() => {
                        log('SUCCESS', 'createPost --> ', 'SUCCESS')
                        return 'post created'
                        }
                    )
                    .catch(error => {
                        if (error.message.includes('E11000')) {
                            log('ERROR', 'createPost --> 4 ', 'user with email ${email} already exists')
                            throw new ConflictError(selectedLanguage.userNotExist)
                        }
                        log('ERROR', 'createPost --> 5 ', error)
                        throw new UnexpectedError(error.message)
                    })
            })
    } catch (error) {
        log('ERROR', 'createPost --> 6 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = createPost