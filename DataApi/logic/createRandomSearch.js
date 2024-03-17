const { errors: { FormatError, NotFoundError, UnexpectedError, LengthError } } = require('com')
const { Searches, Stores } = require('../models')
const selectedLanguage = require('../utils/languages/es.json')
const log = require('../utils/coolog')
const { routerStores, routerAdvertisments, routerDatas, routerInfo, routerSearch } = require('../utils/routuerCollections')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const passwordValidator = require('../utils/passwordValidator')
const routerCollections = require('../utils/routuerCollections')

/**
 * @use This logic create one search whit random items of one collection @use
 * @param {string} token The token of the user
 * @param {string} lat The latitude of the user
 * @param {string} lon The longitude of the user 
 * @param {number} secretPass The secret pass for validate client
 */

async function createRandomSearch(token, lat, lon, secretPass) {

    log('INIT', 'createRandomSearch -->  ', 'INIT')

    const indexValue = 0

    const latValue = parseFloat(lat)
    const lonValue = parseFloat(lon)

    try {
        if (typeof token !== 'string') throw new TypeError(selectedLanguage.tokenNotString)
        if (typeof secretPass !== 'number') throw new TypeError( selectedLanguage.secretPassNotNumber)
        //if (typeof secretPass !== 'number') throw new TypeError(selectedLanguage.secretNotNumber)
        //const isSecretPassValid = passwordValidator(null, token, secretPass)
        //if (isSecretPassValid === false) throw new TypeError(selectedLanguage.tryAgain)
    } catch (error) {
        log('ERROR', 'createRandomSearch --> 1 ', error)
        throw new TypeError(error)
    }

    try {
        if (!token.length) throw new LengthError( selectedLanguage.tokenEmpty)
    } catch (error) {
        log('ERROR', 'createRandomSearch --> 2 ', error)
        throw new LengthError(error)
    }

    try {
        const decodedToken = jwt.decode(token, JWT_SECRET);
        let owner = decodedToken.sub
        let response

        const res = await randomCollection()

        if (res.length < 1) response = 'false'
        else response = res

        return response

        async function randomCollection() {
            //const collections = ['furniture', 'books', 'tv', 'music', 'photography', 'phones', 'computers', 'electronics', 'office', 'games', 'toys', 'kids', 'home', 'tools', 'beautyAndHealth', 'clothes', 'shoes', 'jewelry', 'sport', 'cars', 'motorBikes']

            const collections = ['furniture', 'books']

            const randomIndex = Math.floor(Math.random() * collections.length);
            const collection = collections[randomIndex];

            const dataRouter = await routerDatas(collection)

            let data = await createSearch(collection)

            return data
        }

        async function createSearch(collection) {

            const advertisementsRouter = routerAdvertisments(collection)
            const dataRouter = routerDatas(collection)

            return Stores.find({ location: { $geoWithin: { $centerSphere: [[latValue, lonValue], (300 * 2) / 12275.620] } }, enabled: true })
                .then(stores => {

                    if (!stores) throw new LengthError(selectedLanguage.storesEmpty)

                    
                    function calculateDistance(lat1, lon1, lat2, lon2) {
                        const dLat = (lat2 - lat1) * Math.PI / 180;
                        const dLon = (lon2 - lon1) * Math.PI / 180;

                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);

                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                        const radius = 6371; // Earth radius on km

                        const distance = radius * c;

                        return distance;
                    }

                    return advertisementsRouter.find() // Retrieve data --2
                        .then(add => {
                            return dataRouter.find()
                                .then(furniture => {
                                    if (!furniture.length) {
                                        log('ERROR', 'createFurnitureData --> 3 ', selectedLanguage.furnitureEmpty)
                                        throw new NotFoundError(selectedLanguage.furnitureEmpty)
                                    }

                                    furniture.sort(function (a, b) {
                                  
                                        //TODO: mejorar esto
                                        const eloA = 1000000 - a.numberVisits + (a.numberLikes * 2); 
                                        const eloB = 1000000 - b.numberVisits + (b.numberLikes * 2);
                                    
                                        const scoreA = eloA;
                                        const scoreB = eloB;
                
                                        let res = 0
                                    
                                        if (scoreA < scoreB) res = -1;
                                        if (scoreA > scoreB) res = 1;
                                        return res;
                                    });

                                    if (indexValue === undefined) indexValue = 0;

                                    const furnitureIds = [];
                                    const startIndex = indexValue * 10

                                    for (let i = startIndex; i < startIndex + 10; i++) {
                                        if (furniture[i] !== undefined) {
                                            furnitureIds.push({ id: furniture[i]._id, collection: collection });
                                            furniture[i].numberVisits = furniture[i].numberVisits + 1
                                        }
                                    }

                                    const date = new Date()

                                    return Searches.create({ owner: owner, furniture: furnitureIds, date: date, search: 'none', index: indexValue })
                                        .then(result => {
                                            log('SUCCESS', 'createFurnitureData --> ', 'SUCCESS')
                                            const payload = { sub: decodedToken.sub }
                                            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                                            return { search: result._id, token: token, collection: collection }
                                        })
                                })
                        })
                })
        }
    } catch (error) {
        log('ERROR', 'createRandomSearch --> 7 ', error)
        throw new UnexpectedError(error)
    }
}

module.exports = createRandomSearch
