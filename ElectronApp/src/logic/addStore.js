const { IS_ALPHABETICAL_REGEX, IS_EMAIL_REGEX, HAS_NO_SPACES_REGEX, HAS_SPACES_REGEX } = require('../com/regex/index')
const { FormatError, LengthError, AuthError, ConflictError, NotFoundError, UnexpectedError } = require('../com/errors/index')

/**
 * This logic adds a new store
 * @param {String} query One string whit the query used for find the data on outscraper API
 * @param {String} location One string whit the location [latitude, longitude] for place the store
 * @param {String} name The name of the store finded on google
 * @param {String} adress The full adress of the stpre povided by outscraper of google data.
 * @param {String} postalCode The postal code of the store
 * @param {String} country The country where is location the store
 * @param {String} city The city where is location the store
 * @param {String} state The state where is located the store
 * @param {String} webSide The webSide of the store provided by outscraper API
 * @param {String} phone The phone of the store
 * @param {String} type The kind of store
 * @param {String} logo The logo of the store containded in http
 * @param {Number} rating The rating of the store in google provided for outscraper API
 * @param {Number} totalReviews The total reviews of the store in google
 * @param {Array} reviewsData The data of the reviews for retrive in client
 * @param {Object} workingHours The ours when the store it's open
 * @param {Object} reviewsPerScore The number of reviews for each score
 * @param {String} email The email of the store
 * @param {String} owner The user owner of the store
 * @param {string} userEmail The email of the user
 * @param {object} language One object whit the language
 * @param {string} host The host of the api
 */

function addStore(query, location, name, adress, postalCode,  country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token, userEmail, language, host) {

    try {

        if (typeof logo !== 'string') throw new TypeError(language.logoNotString)
        if (typeof type !== 'string') throw new TypeError(language.typeNotString)
        if (typeof city !== 'string') throw new TypeError(language.cityNotString)
        if (typeof country !== 'string') throw new TypeError(language.countryNotString)
        if (typeof postalCode !== 'string') throw new TypeError(language.postalCodeNotString)
        if (typeof adress !== 'string') throw new TypeError(language.addressNotString)
        if (typeof name !== 'string') throw new TypeError(language.nameNotString)
        if (typeof query !== 'string') throw new TypeError(language.queryNotString)
        if (typeof email !== 'string') throw new TypeError(language.emailNotString)
        if (typeof phone !== 'string') throw new TypeError(language.phoneNotNumber)
        if (typeof webSide !== 'string') throw new TypeError(language.webSiteNotString)
        if (typeof city !== 'string') throw new TypeError(language.cityNotString)
        if (typeof country !== 'string') throw new TypeError(language.cityNotString)
        if (typeof secretPass !== 'number') throw new TypeError(language.secretPassNotNumber)
        if (typeof host !== 'string') throw new TypeError(language.hostNotString)
        if (typeof token !== 'string') throw new TypeError(language.tokenNotString)
        if (typeof collection !== 'string') throw new TypeError(language.collectionNotString)
    } catch (error) { throw new TypeError(error) }

    try {
        if (!name.length) throw new LengthError(language.nameEmpty)
        if (!email.length) throw new LengthError(language.descriptionEmpty)
        if (!webSide.length) throw new LengthError(language.webEmpty)
        if (!country.length) throw new LengthError(language.countryEmpty)
    } catch (error) { throw new LengthError(error) }

    try {
        if (!IS_EMAIL_REGEX.test(email)) throw new FormatError(language.emailNotValid)
    } catch (error) { throw new FormatError(error) }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            const { status, responseText: json } = xhr

            if (status === 200) {
                const data = JSON.parse(json)
                resolve(data.none)
            } else if (status === 400) {
                const { error } = JSON.parse(json)
                if (error.includes('type'))
                    alert(error)
                else if (error.includes('format'))
                    alert(error)
                else if (error.includes('length'))
                    alert(error)
            } else if (status === 401) {
                const { error } = JSON.parse(json)
                alert(error)
            } else if (status === 404) {
                const { error } = JSON.parse(json)
                alert(error)
            } else if (status < 500) {
                const { error } = JSON.parse(json)
                alert(error)
            } else {
                const { error } = JSON.parse(json)
                alert(error)
            }

        }

        xhr.onerror = () => reject(new Error(language.connectionError))


        xhr.open('post', host + 'addStore')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        const payload = { query, location, name, adress, postalCode,  country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, userEmail }

        const json = JSON.stringify(payload)

        xhr.send(json)
    })
}

module.exports = addStore