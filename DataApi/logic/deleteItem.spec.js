require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const deleteItem = require('./deleteItem')
const { expect } = require('chai')
const { Users, Game, Tags, Posts } = require('../models')
const { compareSync } = require('bcryptjs')

 /**
   * @use This logic is used for delete one item @use
   * 
   * @param {string} id The id of the furniture for delete
   * @param {string} collection The collection of the item
   * @param {number} secretPass The password for validate client
   * @param {string} token The token of the user
   */

const {
    errors: { ConflictError, NotFoundError, LengthError, UnexpectedError }, error
} = require('com')

describe('deleteItem', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throw TypeError  id not string
    it("test_id_not_string", () => {

        const id = 1
        const collection = 'furniture'
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteItem(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw LengthError id empty
    it("test_id_empty", () => {

        const id = ''
        const collection = 'furniture'
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteItem(id, collection, secretPass, token)).to.throw(LengthError)

    });

    // Tests that the function throw TypeError collection not string
    it("test_collection_not_string", () => {

        const id = '123123'
        const collection = 1
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteItem(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw TypeError collection empty
    it("test_collection_not_string", () => {

        const id = '123123'
        const collection = 1
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteItem(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw TypeError secretPass not number
    it("test_secretPass_not_number", () => {

        const id = '123123'
        const collection = '1'
        const secretPass = '1234'
        const token = '123456789'

        expect(() => deleteItem(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw TypeError when token not string
    it("test_token_not_string", () => {

        const id = '123123'
        const collection = '1'
        const secretPass = 1234
        const token = 1

        expect(() => deleteItem(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw LengthError when token empty
    it("test_token_empty", () => {

        const id = '123123'
        const collection = '1'
        const secretPass = 1234
        const token = ''

        expect(() => deleteItem(id, collection, secretPass, token)).to.throw(LengthError)
    });

    //Test that the function throw UnexpectedError
    it("test_deleteItem_throw_UnexpectedError", () => {
        const id = '123123'
        const collection = '1'
        const secretPass = 1234
        const token = '1123134'

        expect(() => deleteItem(id, collection, secretPass, token)).to.throw(UnexpectedError)
    })

    after(() => disconnect());
})