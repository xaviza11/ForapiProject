require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const addToBasket = require('./addToBasket')
const { expect } = require('chai')
const { Users, Game, Stores } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticateUser = require('../logic/authenticateUser')

const {
    errors: { ConflictError, FormatError }
} = require('com')
const { game, user } = require('../models/schemas')
const { LengthError, UnexpectedError } = require('com/errors')

/**
 * @use This logic adds items on the basket @use
 * @param {String} secretPass One number for validate the password
 * @param {String} token The current token for validate the passord
 * @param {String} id The id of the basket
 * @param {Object} data The data for include on the basker
 */


describe('addToBasket', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))
    
    // Tests if id not string 
    it("test_addToBasket_id_not_string", async () => {
        const secretPass = 123
        const token = 'abc'
        const id = 1
        const data = {}

        expect(() => addToBasket(secretPass, token, id, data)).throw(TypeError)
    })

    // Tests if data not object
    it("test_addToBasket_data_not_object", async () => {
        const secretPass = 123
        const token = 'abc'
        const id = '1'
        const data = 'abc'

        expect(() => addToBasket(secretPass, token, id, data)).throw(TypeError)
    })

    // Tests if id empty
    it("test_addToBasket_id_empty", async () => {
        const secretPass = 123
        const token = 'abc'
        const id = ''
        const data = {}

        expect(() => addToBasket(secretPass, token, id, data)).throw(LengthError)
    })

    //test if token is not string
    it("test_addToBasket_token_not_string", async () => {
        const secretPass = 123
        const token = 123
        const id = '123'
        const data = {}

        expect(() => addToBasket(secretPass, token, id, data)).throw(TypeError)
    })

    //test if token is not string
    it("test_addToBasket_token_empty", async () => {
        const secretPass = 123
        const token = ''
        const id = '123'
        const data = {}

        expect(() => addToBasket(secretPass, token, id, data)).throw(LengthError)
    })

    // Tests if addToBasket happy test
    it("test_addToBasket_success", () => {
        return authenticateUser('aitor@tilla.com', '123123123', 1234)
            .then(token => {
                return addToBasket(123124, token, '6548f746826eb8533e791070', {})
                .then(basket => {
                    expect(basket).to.be.a('string')
                })
            })
    })

    after(() => disconnect());
})