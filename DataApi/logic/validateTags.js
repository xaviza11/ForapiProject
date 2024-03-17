const {
  errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
  regex: { IS_EMAIL_REGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX, }
} = require('com')
const { Tags } = require('../models')
const { hash } = require('bcryptjs');
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const passwordValidator = require('../utils/passwordValidator')

async function validateTags(token, tagsSearchValue, location, secretPass) {

  log('INIT', 'validateTags --> ', 'WORK')

  /**
* @use This logic validate if each word in the string exist as a tag, then update the number of searches of each tag. If it doesn't exist create a new tag @use
*@param {string} token The token of the user
* @param {string}  tagsSearchValue The string for search the tags on data
* @param {object} location The location of the user with the latitude, longitude and accuracy 
* @param {number} secretPass The secret pass for validate client
*/

  try {
    if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
    if (typeof secretPass !== 'number') throw new TypeError(selectedLanguage.secretPassNotNumber)
    //const isSecretPassValid = passwordValidator(token, null, secretPass)
    //if (isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
    if (typeof tagsSearchValue !== 'string') throw new TypeError(selectedLanguage.tagsNotString)
    if (typeof location !== 'object') if (typeof location !== 'string') throw new TypeError(selectedLanguage.locationNotObject)
  } catch (error) {
    log('ERROR', 'validateTags --> 1 ', error)
    throw new TypeError(error)
  }

  try {
    if (!token.length) throw new LengthError(selectedLanguage.tokenEmpty)
  } catch (error) {
    log('ERROR', 'validateTags --> 2 ', error)
    throw new LengthError(error)
  }

  try {

    function roundCoordinates(coordinates) {
      const rounding = 0.2;
      const newLatitude = (Math.round(coordinates.lat / rounding) * rounding).toFixed(1);
      const newLongitude = (Math.round(coordinates.lon / rounding) * rounding).toFixed(1);
      return { lat: parseFloat(newLatitude), lon: parseFloat(newLongitude), acc: coordinates.acc, numberSearches: 1 };
    }

    const roundedCoordinates = roundCoordinates(location);

    const tagsSearchValueArray = tagsSearchValue.split(',').map(tag => tag.trim());

    const tags = await Tags.find({ name: { $in: tagsSearchValueArray } });
    let isUpdated = false

    for (let i = tagsSearchValueArray.length - 1; i >= 0; i--) {
      const validate = tags.some(tag => tag.name === tagsSearchValueArray[i]);

      if (!validate) {
        const name = tagsSearchValueArray[i];
        await Tags.create({ name, locations: roundedCoordinates });
      } else {
        const ret = await Tags.findOne({ name: tagsSearchValueArray[i] });

        for (let i = 0; i < ret.locations.length; i++) {
          if (ret.locations[i].lat === roundedCoordinates.lat && ret.locations[i].lon === roundedCoordinates.lon) {
            ret.numberSearches += 1;
            const newLat = ret.locations[i].lat;
            const newLon = ret.locations[i].lon;
            const newAcc = ret.locations[i].acc;
            const newNumberSearches = ret.locations[i].numberSearches + 1;
            ret.locations[i] = { lat: newLat, lon: newLon, acc: newAcc, numberSearches: newNumberSearches };
            await ret.save();
            isUpdated = true
            break
          }
        }

        if (!isUpdated) {
          ret.locations.push(roundedCoordinates);
          ret.numberSearches += 1;
          await ret.save();
        }

        log('SUCCESS', 'validateTags --> ', 'SUCCESS');
      }
    }
  } catch (error) {
    log('ERROR', 'validateTags --> 3 ', error);
    throw new UnexpectedError(error);
  }
}

module.exports = validateTags