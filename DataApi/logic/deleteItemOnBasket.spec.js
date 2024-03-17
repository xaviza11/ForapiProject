require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const deleteItemOnBasket = require('./deleteItemOnBasket')
const { expect } = require('chai')
const { Users, Game, Tags, Posts } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, LengthError, UnexpectedError }, error
} = require('com')

/**
 * @use This logic is used for delete one item inside basket @use
 * @param {string} id The id of the basket
 * @param {string} index The index of the item inside the basket
 * @param {number} secretPass Yhe secretPass for validate client
 * @param {string} Token The token of the user
 */

describe('deleteItemOnBasket', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throw TypeError id not string
    it("test_id_not_string", () => {

        const id = 1
        const index = 1
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteItemOnBasket(id, index, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw LengthError when id empty
    it("test_id_empty", () => {

        const id = ''
        const index = 1
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteItemOnBasket(id, index, secretPass, token)).to.throw(LengthError)

    });

    // Tests that the function throw TypeError when index not number
    it("test_collection_not_string", () => {

        const id = '123123'
        const index = '1'
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteItemOnBasket(id, index, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the fnction throw secretPass not number
    it("test_secretPass_not_number", () => {

        const id = '123123'
        const index = 1
        const secretPass = '1234'
        const token = '123456789'

        expect(() => deleteItemOnBasket(id, index, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw TypeError token not string
    it("test_token_not_string", () => {

        const id = '123123'
        const index = 1
        const secretPass = 1234
        const token = 1

        expect(() => deleteItemOnBasket(id, index, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw LengthError when token empty
    it("test_token_empty", () => {

        const id = '123123'
        const index = 1
        const secretPass = 1234
        const token = ''

        expect(() => deleteItemOnBasket(id, index, secretPass, token)).to.throw(LengthError)

    });

    // Tests deleteItemOnBasket success
    it("test_deleteItemOnBasket_success", () => {
        const id = '6548f746826eb8533e791070'
        const index = 1
        const secretPass = 1234

        return authenticate("store1@store1.com", '123123123', 1234)
        .then(token => {
            expect(() => deleteItemOnBasket(id, index, secretPass, token)).to.have.property('token')
        })
    })

    after(() => disconnect());
})