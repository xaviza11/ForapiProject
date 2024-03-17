const {
    errors: { FormatError, LengthError, ConflictError, UnexpectedError, NotFoundError },
    regex: { IS_EGEX, HAS_SPACES_REGEX, IS_ALPHABETICAL_REGEX, HAS_NO_SYMBOLS_REGEX }
} = require('com')
const {Searches, Stores} = require('../models')
const { hash } = require('bcryptjs')
const { stores } = require('../models/schemas')
const log = require('../utils/coolog')
const { routerAdvertisments, routerDatas } = require('../utils/routuerCollections')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')

/**
 * @use This logic creates a new search using the next parameters @use
 * @param {string} token The token 
 * @param {string} tagsSearchValue The tags searched
 * @param {number} indexValue The index of the search
 * @param {string} lat The latitude of the search
 * @param {string} lon The longitude of the search
 * @param {string} slider This value contains the km of the search
 * @param {string} acc The accuracy of the search
 * @param {string} collection The collection
 * @param {number} secretPass The secret pass for validate if request coming from clien 
 */

const selectedLanguage = require('../utils/languages/es.json')

function createSearch(token, tagsSearchValue, indexValue, lat, lon, slider, acc, collection, secretPass) {

    log('INIT', 'createSearch', 'WORK')

    if (typeof tagsSearchValue !== 'string') throw new TypeError( selectedLanguage.tagsNotString)

    const latValue = parseFloat(lat)
    const lonValue = parseFloat(lon)
    const sliderValue = parseInt(slider)
    const accValue = parseFloat(acc)

    const tagsSearchValueLow = tagsSearchValue.toLowerCase()

    let tagsSearchValueArray = tagsSearchValueLow.split(' ');

    tagsSearchValueArray = tagsSearchValueArray.map(tag => tag.replace(/[^\w\s]/gi, ''));

    tagsSearchValueArray = tagsSearchValueArray.filter(tag => /^[a-z0-9]+$/i.test(tag));

    try {
        if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //const isSecretPassValid = passwordValidator(token, null, secretPass)
        //if (isSecretPassValid === false) throw new TypeError('error: ' + selectedLanguage.tryAgain)
        if (typeof latValue !== 'number') throw new TypeError( selectedLanguage.latNotNumber)
        if (typeof lonValue !== 'number') throw new TypeError( selectedLanguage.lonNotNUmber)
        if (typeof sliderValue !== 'number') throw new TypeError('type: slider ' + selectedLanguage.notNumber)
        if (typeof accValue !== 'number') throw new TypeError('type: acc ' + selectedLanguage.notNumber)
        if (typeof token !== 'string') throw new TypeError( selectedLanguage.tokenNotString)
        if (typeof indexValue !== 'number') throw new TypeError('type: indexValue ' + selectedLanguage.notNumber)
        if (typeof tagsSearchValueLow !== 'string') throw new TypeError( selectedLanguage.tagsNotString)
        if (typeof collection !== 'string') throw new TypeError( selectedLanguage.collectionNotString)
    } catch (error) {
        log('ERROR', 'createSearch --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!token) throw new LengthError( selectedLanguage.tokenEmpty)
        if (!tagsSearchValueLow) throw new LengthError( selectedLanguage.tagsEmpty)
        if (!collection.length) throw new LengthError( selectedLanguage.collectionEmpty)
    } catch (error) {
        log('ERROR', 'createSearch --> 2 ', error)
        throw new LengthError(error)
    }

    try {
    
        const decodedToken = jwt.decode(token, JWT_SECRET);

        const advertisementsRouter = routerAdvertisments(collection)
        const dataRouter = routerDatas(collection)

        return Stores.find({ location: { $geoWithin: { $centerSphere: [[latValue, lonValue], (sliderValue * 2) / 12275.620] } }})
        .then(stores => {

                if (stores.length < 1) throw new LengthError(selectedLanguage.storesEmpty)
                
                function calculateDistance(lat1, lon1, lat2, lon2) {
                    const dLat = (lat2 - lat1) * Math.PI / 180;
                    const dLon = (lon2 - lon1) * Math.PI / 180;
                
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                              Math.sin(dLon / 2) * Math.sin(dLon / 2);
                
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                
                    const radius = 6371; // Earth radius
                
                    const distance = radius * c;
                
                    return distance;
                }

                return advertisementsRouter.find({ tags: { $in: tagsSearchValueArray } }) // Retrieve data --2
                    .then(add => {
                        return dataRouter.find({ tags: { $all: tagsSearchValueArray } })
                            .then(item => {
                                item.sort(function (a, b) {
                                  
                                    //TODO: improve this logic 
                                    const eloA = 1000000 - a.numberVisits + (a.numberLikes * 2); 
                                    const eloB = 1000000 - b.numberVisits + (b.numberLikes * 2);

                                    const distanceA = 10000
                                    const distanceB = 10000
                                
                                    const scoreA = distanceA + eloA;
                                    const scoreB = distanceB + eloB;
            
                                    let res = 0
                                
                                    if (scoreA < scoreB) res = -1;
                                    if (scoreA > scoreB) res = 1;
                                    return res;
                                });

                                if (!item.length) {
                                    log('ERROR', 'createSearch --> 3 ', selectedLanguage.furniture + selectedLanguage.empty)
                                    throw new NotFoundError(selectedLanguage.notItems)
                                }
                                if (indexValue === undefined) indexValue = 0;

                                const itemsId = [];
                                const startIndex = indexValue * 10

                                for (let i = startIndex; i < startIndex + 10; i++) {
                                    if(item[i] !== undefined){ 
                                        itemsId.push({id: item[i]._id, collection: collection});
                                        item[i].numberVisits = item[i].numberVisits + 1
                                    }
                                }

                                const date = new Date()

                                let owner = decodedToken.sub

                                return Searches.create({ owner: owner, furniture: itemsId, date: date, search: tagsSearchValue, index: indexValue })
                                    .then(result => {
                                        log('SUCCESS', 'createSearch --> ', 'SUCCESS')
                                        const payload = { sub: decodedToken.sub }
                                        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                                        return { furniture: result._id, token: token }
                                    })
                            })
                    })
            })
    } catch (error) {
        log('ERROR', 'createSearch --> 6 ', error)
        throw new UnexpectedError(error)
    }
}
module.exports = createSearch