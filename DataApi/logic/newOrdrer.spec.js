require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const createPost = require('./createPost')
const { expect } = require('chai')
const { Users, Game, Tags, Posts, FurnitureOrders } = require('../models')
const { compareSync } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')
const authenticate = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const newOrder = require('./newOrder')


/**
 * @use This logic create a new order of one furniture @use //! Needs improve it because doesn't works with more than one furniture so users can't create a basket.
 * @param {string} token The token of the user
 * @param {string}storeId The id of the store
 * @param {object} messages One object whit the new message
 * @param {array} item One array whit the items 
 * @param {number} secretPass The secret pass for validate the client
 * @param {string} collection The collection //!not used
 * @param {string} deadLine One string whit one date
 */

describe('newOrder', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", () => {
        const token = 1
        const storeId = 'asdf'
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = '123'
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(TypeError);
    });

    // Tests that the function throws a LenghtError when token empty
    it("test_token_empty", () => {
        const token = ''
        const storeId = 'asdf'
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = '123'
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when storeId not string
    it("test_storeId_not_string", () => {
        const token = '1'
        const storeId = 1
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = '123'
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(TypeError);
    })

    // Tests that the function throws a LenghError when storeId empty
    it("test_storeId_empty", () => {
        const token = '1'
        const storeId = ''
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = '123'
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(LengthError);
    })

    // Tests that the function throws a TypeError when mesages not object
    it("test_messages_not_object", () => {
        const token = '1'
        const storeId = 'asdf'
        const messages = 'abc'
        const item = []
        const secretPass = 1234
        const collection = '123'
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(TypeError);
    })

    // Tests that the function throws a TypeError when item not array
    it("test_item_not_array", () => {
        const token = '1'
        const storeId = 'asdf'
        const messages = {}
        const item = 'adv'
        const secretPass = 1234
        const collection = '123'
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(TypeError);
    })

    // Tests that the function throws a TypeError when secretPass not number
    it("test_secretPass_not_number", () => {
        const token = '1'
        const storeId = 'asdf'
        const messages = {}
        const item = []
        const secretPass = '1234'
        const collection = '123'
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(TypeError);
    })

    // Tests that the function throws a TypeError when collection not string
    it("test_collection_not_string", () => {
        const token = '1'
        const storeId = 'asdf'
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = 123
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(TypeError);
    })

    // Tests that the function throws a LenghtError when collection empty
    it("test_collection_not_string", () => {
        const token = '1'
        const storeId = 'asdf'
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = ''
        const deadLine = '123'
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(LengthError);
    })

    // Tests that the function throws a LenghtError when deadLine empty
    it("test_deadLine_empty", () => {
        const token = '1'
        const storeId = 'asdf'
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = 'asdf'
        const deadLine = ''
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(LengthError);
    })

    // Tests that the function throws a TypeError when deadLine not string
    it("deadLine_not_string", () => {
        const token = '1'
        const storeId = 'asdf'
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = 'asdf'
        const deadLine = 1234
        expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw(TypeError);
    })

    // Tests if newOrder has been created
    it("test_newOrder_success", () => {
        const storeId = '63d92290ddf1f831d9eacd53'
        const messages = {}
        const item = []
        const secretPass = 1234
        const collection = 'asdf'
        const deadLine = 1234

        return authenticate('store1@store1.com', '123123123', 1234)
        .then(token => {
            expect(() => newOrder(token, storeId, messages, item, secretPass, collection, deadLine)).to.throw('token')
        })
    })

    after(() => disconnect());
})