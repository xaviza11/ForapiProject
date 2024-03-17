const { errors: { FormatError, NotFoundError, LengthError, UnexpectedError } } = require('com')
const { Users, Posts } = require('../models')
const { posts } = require('../models/schemas')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')

/**
 * This logic retrieve the posts of one furniture
 * @param {string}  furnitureId The id of the furniture
 */

function retrievePosts(furnitureId) {

    log('INIT', 'retrievePosts -->  ', 'INIT')

    try {
        if (typeof furnitureId !== 'string') throw new TypeError('type:' + selectedLanguage.articlesMales + selectedLanguage.furniture + selectedLanguage.notString)
    } catch (error) { 
        log('ERROR', 'retrievePosts --> 1 ', error)
        throw new TypeError(error) }

    try {
        if (!furnitureId) throw new LengthError(selectedLanguage.articlesMales + selectedLanguage.furniture + selectedLanguage.notLength)
    } catch (error) { 
        log('INIT', 'retrievePosts --> 2 ', error)
        throw new LengthError(error) }

    try {
        return Posts.find({ furnitureId: furnitureId })
            .then(posts => {
                if (!posts){
                    log('INIT', 'retrievePosts --> 3  ', selectedLanguage.empty)
                    throw new NotFoundError(selectedLanguage.empty)
                } 
                for (let i = posts.length - 1; i >= 0; i--) {
                    delete posts[i]._doc.furnitureId
                }
                log('SUCCESS', 'retrievePosts -->  ', 'SUCCESS')
                return { posts }
            })
    } catch (error) {
        log('ERROR', 'retrievePosts --> 4 ', selectedLanguage.empty)
        throw new UnexpectedError(error) }
}

module.exports = retrievePosts