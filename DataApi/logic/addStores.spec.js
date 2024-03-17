require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const addStore = require('./addStore')
const { expect } = require('chai')
const { Users, Game, Stores } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticateUser = require('../logic/authenticateUser')
const createCode = require('../logic/createCode')

const {
    errors: { ConflictError, FormatError }
} = require('com')
const { game, user } = require('../models/schemas')
const { LengthError, UnexpectedError } = require('com/errors')

/**
 * @use This logic adds a new store @use
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
 */

describe('addStores', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function successfully creates a new store in the database with valid input parameters. 
    it("test_store_valid_input", async () => {
        const token = '123'
        const secretPass = 123
        const query = 'abc'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = 'tornillolandia'
        const postalCode = '434343'
        const country = 'f'
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.exist
    })

    // Tests that the function throws an error when query not string 
    it("test_query_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = 123
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = 'tornillolandia'
        const postalCode = '434343'
        const country = 'f'
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when query not length 
    it("test_query_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = ''
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = 'tornillolandia'
        const postalCode = '434343'
        const country = 'f'
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when adress not string 
    it("test_adress_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = 123
        const postalCode = '434343'
        const country = 'f'
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when adress not string 
    it("test_adress_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = ''
        const postalCode = '434343'
        const country = 'f'
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when postalCode not string 
    it("test_postalCode_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = 434343
        const country = 'f'
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when postalCode  empty
    it("test_postalCode_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = ''
        const country = 'f'
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when country not string 
    it("test_country_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = 1
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when country empty
    it("test_country_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '123'
        const country = ''
        const city = 'Test City'
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when city not string 
    it("test_city_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 123
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when country empty
    it("test_country_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '123'
        const country = '1'
        const city = ''
        const state = 'j'
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when state not string 
    it("test_state_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 'Test City'
        const state = 1
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when city empty
    it("test_state_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '123'
        const country = '1'
        const city = '1'
        const state = ''
        const webSide = 'www.teststore.com'
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when webSide not string 
    it("test_webSide_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 'Test City'
        const state = '1'
        const webSide = 1
        const phone = '1234567890'
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when phone not string 
    it("test_phone_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 'Test City'
        const state = '1'
        const webSide = '1'
        const phone = 1
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when phone empty
    it("test_phone_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '123'
        const country = '1'
        const city = '1'
        const state = '1'
        const webSide = '1'
        const phone = ''
        const type = 'abc'
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when type not string 
    it("test_type_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 'Test City'
        const state = '1'
        const webSide = '1'
        const phone = '1'
        const type = 1
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when type empty
    it("test_type_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '123'
        const country = '1'
        const city = '1'
        const state = '1'
        const webSide = '1'
        const phone = '1'
        const type = ''
        const logo = 'http'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when logo not string 
    it("test_logo_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 'Test City'
        const state = '1'
        const webSide = '1'
        const phone = '1'
        const type = '1'
        const logo = 1
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when logo not string 
    it("test_logo_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 'Test City'
        const state = '1'
        const webSide = '1'
        const phone = '1'
        const type = '1'
        const logo = 1
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when email empty
    it("test_email_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '123'
        const country = '1'
        const city = '1'
        const state = '1'
        const webSide = '1'
        const phone = '1'
        const type = '1'
        const logo = '1'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = ''
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when email not string 
    it("test_email_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 'Test City'
        const state = '1'
        const webSide = '1'
        const phone = '1'
        const type = '1'
        const logo = 1
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 1
        const owner = '123asd123'
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests that the function throws an error when owner empty
    it("test_owner_empty", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '123'
        const country = '1'
        const city = '1'
        const state = '1'
        const webSide = '1'
        const phone = '1'
        const type = '1'
        const logo = '1'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = ''
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(LengthError)
    })

    // Tests that the function throws an error when owner not string 
    it("test_owner_not_string", () => {
        const token = '123'
        const secretPass = 123
        const query = '123'
        const location = { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }
        const name = 'Test Store'
        const adress = '123'
        const postalCode = '434343'
        const country = '1'
        const city = 'Test City'
        const state = '1'
        const webSide = '1'
        const phone = '1'
        const type = '1'
        const logo = '1'
        const rating = 5
        const totalReviews = 19
        const reviewsData = ['pepe']
        const workingHours = { pepe: "pepe" }
        const reviewsPerScore = { pepe: 'pepe' }
        const email = 'lasenia@zonamobel.com'
        const owner = 1
        const collection = 'furniture'

        expect(() => addStore(query, location, name, adress, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, token)).to.throw(TypeError)
    })

    // Tests if store is created
    it("test_store_created", () => {
        return authenticateUser('lasenia@zonamobel.com', '123123123', 1234)
            .then(async token => {
                const res = await addStore('abcde', { "coordinates": "40.630167799999995, 0.293332", "type": "Point" }, 'newStore', 'cellejuela, 123', '56789', 'spain', 'gotham', 'moon', 'a@a.com', '654456654', 'furniture store', 'http://meme.meme', 5, 39, [], {}, {}, 'store1@store1.com', '643fac37a4f55db3b835f231', 'furniture', 77675, token)
                expect(res).to.have.property('token')
            })
    })

    after(() => disconnect());
})