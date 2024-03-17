const {
  errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
  regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX, HAS_NO_SYMBOLS_REGEX }
} = require('com')
const {Countries } = require('../models')
const { hash } = require('bcryptjs')
const { stores } = require('../models/schemas')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')


/**
* @use This logic retrieve the country on the client is connected to the backend @use
* @param {string}  lat The latitude of the user
* @param {string} lon The longitude of the user
*/

function retrieveCountry(lat, lon) {

  log('INIT', 'retrieveCountry -->  ', 'WORK')

  try {
    const latValue = parseFloat(lat)
    const lonValue = parseFloat(lon)
    if (typeof latValue !== 'number') throw new TypeError( selectedLanguage.latNotNumber)
    if (typeof lonValue !== 'number') throw new TypeError( selectedLanguage.lonNotNUmber)
  } catch (error) {
    log('ERROR', 'retrieveCountry --> 1 ', error)
    throw new TypeError(error)
  }

  return Countries.find({ location: { $geoIntersects: { $geometry: { type: "Point", coordinates: [latValue, lonValue] } } } })
    .then(country => {
      if (!country) {
        log('ERROR', 'retrieveCountry --> 2 ', selectedLanguage.countryEmpty)
        throw new NotFoundError(selectedLanguage.countryEmpty)
      }
      log('SUCCESS', 'retrieveCountry -->  ', 'SUCCESS')
      return country
    })

}

module.exports = retrieveCountry