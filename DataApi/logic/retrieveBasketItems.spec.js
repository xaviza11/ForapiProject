require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveBasketItems = require('./retrieveBasketItems')
const { expect } = require('chai')
const { Users } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, TypeError, LengthError }
} = require('com')
const authenticateUser = require('../logic/authenticateUser')

/**
* @use This logic retrieve the basketId of the user @use
* @param {string} id The id of the basket
* @param {string} token The token of the user
* @param {number} secretPass One pass for validate the client
*/

describe('retrieveBasketItems', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throw TypeError when id is not string
    it("test_id_not_string", () => {
        expect(() => retrieveBasketItems(123, '123123', 1234)).throw(TypeError)
    })

    // Tests that the function throw LengthError when id is empty
    it("test_id_empty", () => {
        expect(() => retrieveBasketItems('', '123123', 1234)).throw(LengthError)
    })

    // Test that the function throw TypeError token is not string
    it("test_token_not_string", () => {
        expect(() => retrieveBasketItems('123', 123, 123)).throw(TypeError)
    })

    //test that the function throw LengthError token is empty
    it("test_token_empty", () => {
        expect(() => retrieveBasketItems('123', '', 123)).throw(LengthError)
    })

    //test that the function throw TypeError secretPass not number
    it("test_token_secretPass_not_number", () => {
        expect(() => retrieveBasketItems('123', 'asdfadf', '123')).throw(TypeError)
    })

    // Tests if funciton retrieve the basket
    it("test_retrieveBasket_success", () => {
        return authenticateUser('aitor@tilla.com', '123123123', 1234)
        .then(async token => {
            const res = await retrieveBasketItems('6548f746826eb8533e791070', token, 1234)
            expect(res).to.have.property('token')
        })
    })

    after(() => disconnect())
})