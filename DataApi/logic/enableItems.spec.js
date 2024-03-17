require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const enableItems = require('./enableItems')
const { expect } = require('chai')
const { Users, Search, Stores } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')

/**
 * @use This enable store when user add credit @use 
 * @param {string} token The token of the user
 * @param {string} storeId The storeId for update store 
 */

describe('enableItems', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", () => {
        expect(() => enableItems(12, '1234')).to.throw(TypeError);
    });

    //Test that the function throws a LengthError when token not length
    it("test_token_empty", () => {
        expect(() => enableItems('', '1234')).to.throw(LengthError)
    })

    //Test that the function throws a TypeError when storeId not string
    it("test_storeId_not_string", () => {
        expect(() => enableItems('123', 1234)).to.throw(TypeError)
    })

    //Test that the function throws a LengthError when storeId not length
    it("test_storeId_not_length", () => {
        expect(() => enableItems('123', '')).to.throw(LengthError)
    })

    //Test that the function happy test
    it("test_updateImage_success", () => {
        return authenticate('aitor@tilla.com', '123123123', 1234)
        .then(async token => {
            await enableItems(token, '63d909dc14e699f7331249ad')
            Stores.find({_id: '63d909dc14e699f7331249ad'})
            .then(store => {
                expect(store.enable).to.equal(true)
            })
        })
    })

    after(() => disconnect())
})