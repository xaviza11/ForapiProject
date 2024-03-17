require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveOneStore = require('./retrieveOneStore')
const { expect } = require('chai')
const { Users, Search } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')

describe('retrieveOneStore', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    /**
     * @use This logic retrieve one store @use
     * @param {string} storeId The id of the store
     * @param {string} collection The collection of the store
     * @param {number} secretPass The number for validate client
     * @param {string} token The token of the user
     */

    // Tests that the function throws a TypeError when storeId not string
    it("test_storeId_not_string", () => {
        expect(() => retrieveOneStore(23, 'c', '12', 123)).to.throw(TypeError);
    });

    // Tests that the function throws a LenghtError when storeId empty. 
    it("test_storeId_empty", () => {
        expect(() => retrieveOneStore('', 'c', 123, '123')).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", () => {
        expect(() => retrieveOneStore('23', 'c', 12, 123)).to.throw(TypeError);
    });

    // Tests that the function throws a LenghtError when token empty
    it("test_token_empty", () => {
        expect(() => retrieveOneStore('23', 'c', 123, '')).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when secretPass not number
    it("test_secretPass_not_number", () => {
        expect(() => retrieveOneStore('23', '12', '123', 't')).to.throw(TypeError);
    });

    //test that the function throws a TypeError when collection not lenght
    it("test_collection_not_string", () => {
        expect(() => retrieveOneStore('1234', '', 123, '1234')).to.throw(TypeError)
    })

    // Tests that the function throws error when token not valid
    it("test_retrieveOneStore_token_not_valid", async () => {
        try {
            await retrieveOneStore('63d92290ddf1f831d9eacd53', 'none', 1234, '12314')
        } catch (error) {
            expect(error.message).to.include('Cannot read properties of null')
        }
    })

    // Tests that the funciton retrieveOneStore
    it("test_retrieveOneStore_success", () => {
        return authenticate('store1@store1.com', '123123123', 1234)
            .then(async token => {
                const res = await retrieveOneStore('63d92290ddf1f831d9eacd53', 'none', 1234, token)
                expect(res).to.have.property('token')
                expect(res).to.have.property('name')
                expect(res).to.have.property('webSide')
            })
    })

    after(() => disconnect())
})