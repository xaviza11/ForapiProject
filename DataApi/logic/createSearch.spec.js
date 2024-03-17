require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const createSearch = require('./createSearch')
const { expect } = require('chai')
const { Users, Game, Tags, Posts } = require('../models')
const { compareSync } = require('bcryptjs')
const autenticatheUser = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')

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

describe('createSearch', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", async () => {

        const token = 1
        const tagsSearchValue = 'abc'
        const indexValue = 0
        const lat = '1'
        const lon = '1'
        const slider = '100'
        const acc = '100'
        const collection = 'furniture'
        const secretPass = 1234

        try {
            await createSearch(token, tagsSearchValue, indexValue, lat, lon, slider, acc, collection, secretPass)
        } catch (error) {
            expect(error.message).to.equal('TypeError: El token no es una string')
        }
    });

    // Tests that the function throws a LengthError when token empty
    it("test_token_empty", async () => {

        const token = ''
        const tagsSearchValue = 'abc'
        const indexValue = 0
        const lat = '1'
        const lon = '1'
        const slider = '100'
        const acc = '100'
        const collection = 'furniture'
        const secretPass = 1234

        try {
            await createSearch(token, tagsSearchValue, indexValue, lat, lon, slider, acc, collection, secretPass)
        } catch (error) {
            expect(error.message).to.equal('LengthError: El token esta vacío')
        }
    });

    // Tests that the function throws a LengthError when collection empty
    it("test_collection_empty", async () => {

        const token = 'asdfasdf'
        const tagsSearchValue = 'asdf'
        const indexValue = 0
        const lat = '1'
        const lon = '1'
        const slider = 'asdf'
        const acc = '100'
        const collection = ''
        const secretPass = 1234

        try {
            await createSearch(token, tagsSearchValue, indexValue, lat, lon, slider, acc, collection, secretPass)
        } catch (error) {
            expect(error.message).to.equal('LengthError: La colección esta vacía')
        }
    });

    // Tests that the function throws a TypeError when collection notString
    it("test_collection_not_string", async () => {

        const token = 'asdfasdf'
        const tagsSearchValue = 'asdf'
        const indexValue = 0
        const lat = '1'
        const lon = '1'
        const slider = 'asdf'
        const acc = '100'
        const collection = 1
        const secretPass = 1234

        try {
            await createSearch(token, tagsSearchValue, indexValue, lat, lon, slider, acc, collection, secretPass)
        } catch (error) {
            expect(error.message).to.equal('TypeError: La colección no es una string')
        }
    });

    // Tests that the function throws a TypeError when secretPass not number
    it("test_collection_not_string", async () => {

        const token = 'asdfasdf'
        const tagsSearchValue = 'asdf'
        const indexValue = 0
        const lat = '1'
        const lon = '1'
        const slider = 'asdf'
        const acc = '100'
        const collection = '1'
        const secretPass = '1234'
        try {
            await createSearch(token, tagsSearchValue, indexValue, lat, lon, slider, acc, collection, secretPass)
        } catch (error) {
            expect(error.message).to.equal('TypeError: La key no es un numero')
        }
    });

    // Test that the function throw error
    it("test_search_throw_error", async () => {
        try{
            await createSearch('adfadfasdljfakdn', 'canape', 5, 40.6379, 0.2768, 300, 345, 'furniture', 123)
        }catch(error){
            expect(error.message).to.equal('No hay tiendas')
        }
    })

    // Tests if search has been created
    it("test_search_is_created", () => {
        return autenticatheUser('aitor@tilla.com', '123123123', 1234)
            .then(async token => {
                await createSearch(token, 'canape', 5, 40.6379, 0.2768, 300, 345, 'furniture', 1234)
            })
    })

    after(() => disconnect())
})