require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const createRandomSearch = require('./createRandomSearch')
const { expect } = require('chai')
const { Users, Game, Tags, Posts } = require('../models')
const { compareSync } = require('bcryptjs')
const autenticatheUser = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')

/**
 * @use This logic create one search whit random items of one collection @use
 * @param {string} token The token of the user
 * @param {string} lat The latitude of the user
 * @param {string} lon The longitude of the user 
 * @param {number} secretPass The secret pass for validate client
 */

describe('createRandomSearch', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", async () => {

        const token = 1
        const lat = '1'
        const lon = '1'
        const secretPass = 1234

        try {
            await createRandomSearch(token, lat, lon, secretPass)
        } catch (error) {
            expect(error.message).to.equal('TypeError: El token no es una string')
        }
    });

    // Tests that the function throws a LengthError when token empty
    it("test_token_empty", async () => {

        const token = ''
        const lat = '1'
        const lon = '1'
        const secretPass = 1234

        try {
            await createRandomSearch(token, lat, lon, secretPass)
        } catch (error) {
            expect(error.message).to.equal('LengthError: El token esta vacío')
        }
    });

    // Tests that the function throws a LengthError when token empty
    it("test_secretPass_not_number", async () => {

        const token = '1234'
        const lat = '1'
        const lon = '1'
        const secretPass = '1234'

        try {
            await createRandomSearch(token, lat, lon, secretPass)
        } catch (error) {
            expect(error.message).to.equal('TypeError: La key no es un numero')
        }
    })

    it("test_token_empty", async () => {

        const token = ''
        const lat = '1'
        const lon = '1'
        const secretPass = 1234

        try {
            await createRandomSearch(token, lat, lon, secretPass)
        } catch (error) {
            expect(error.message).to.equal('LengthError: El token esta vacío')
        }
    })


    // Test that the function throw error
    it("test_search_throw_error", async () => {
        try {

            await createRandomSearch('adfadfasdljfakdn', 40.6379, 0.2768, 123)
        } catch (error) {
            expect(error.message).to.include('TypeError: Cannot read properties of null')
        }
    })

    // Tests if search has been created
    it("test_search_is_created", () => {

        return autenticatheUser('aitor@tilla.com', '123123123', 1234)
            .then(async token => {
                await createRandomSearch(token, 40.6379, 0.2768, 1234)
            })
    })

    after(() => disconnect())

})