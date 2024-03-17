require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const deleteStore = require('./deleteStore')
const { expect } = require('chai')
const { Users, Game, Tags, Posts } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticateUser = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, LengthError, UnexpectedError }, error
} = require('com')

describe('deleteStore', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    /**
 * @use This logic is used for delete one store @use
 * @param {string} id The id of the furniture
 * @param {string} collection The collection of the store
 * @param {number} secretPass Yhe secretPass for validate client
 * @param {string} Token The token of the user
 */

    // Tests that the function throw TypeError when id not string
    it("test_id_not_string", () => {

        const id = 1
        const collection = 'furniture'
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteStore(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function trhow LengthError when  id empty
    it("test_id_empty", () => {

        const id = ''
        const collection = 'furniture'
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteStore(id, collection, secretPass, token)).to.throw(LengthError)

    });

    // Tests that the function throw TypeError when collection not string
    it("test_collection_not_string", () => {

        const id = '123123'
        const collection = 1
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteStore(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that function throw TypeError when collection empty
    it("test_collection_not_string", () => {

        const id = '123123'
        const collection = 1
        const secretPass = 1234
        const token = '123456789'

        expect(() => deleteStore(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw TypeError when secretPass not number
    it("test_secretPass_not_number", () => {

        const id = '123123'
        const collection = '1'
        const secretPass = '1234'
        const token = '123456789'

        expect(() => deleteStore(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function Throw TypeError when token not string
    it("test_token_not_string", () => {

        const id = '123123'
        const collection = '1'
        const secretPass = 1234
        const token = 1

        expect(() => deleteStore(id, collection, secretPass, token)).to.throw(TypeError)

    });

    // Tests that the function throw LengthError when token empty
    it("test_token_empty", () => {

        const id = '123123'
        const collection = '1'
        const secretPass = 1234
        const token = ''

        expect(() => deleteStore(id, collection, secretPass, token)).to.throw(LengthError)

    });

    // Tests deleteStore success
    it("test_deleteStore_success", () => {
        const id = '1234'
        const collection = '1'
        const secretPass = 1234

        return authenticateUser('store1@store1.com', '63d909dc14e699f7331249ad', 1234)
            .then(token => {
                expect(() => deleteStore(id, collection, secretPass, token)).to.have.property('token')
            })
    })

    after(() => disconnect());
})