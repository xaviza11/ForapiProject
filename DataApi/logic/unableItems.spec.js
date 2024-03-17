require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const unableItems = require('./unableItems')
const { expect } = require('chai')
const { Users, Search, Stores } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')

describe('unableItems', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    /**
    * @use This unable store when not has more credits @use 
    * @param {string} token The token of the user
    * @param {string} storeId The storeId for update store 
    */

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", () => {
        expect(() => unableItems(12, '1234')).to.throw(TypeError);
    });

    //Test that the function throws a LengthError when token not length
    it("test_token_empty", () => {
        expect(() => unableItems('', '1234')).to.throw(LengthError)
    })

    //Test that the function throws a TypeError when storeId not string
    it("test_storeId_not_string", () => {
        expect(() => unableItems('123', 1234)).to.throw(TypeError)
    })

    //Test that the function throws a LengthError when storeId not length
    it("test_storeId_not_length", () => {
        expect(() => unableItems('123', '')).to.throw(LengthError)
    })

    //Test that the function happy test
    it("test_updateImage_success", () => {
        return authenticate('aitor@tilla.com', '123123123', 1234)
            .then(async token => {
                await unableItems(token, '63d909dc14e699f7331249ad')
                Stores.find({ _id: '63d909dc14e699f7331249ad' })
                    .then(store => {
                        expect(store.enable).to.equal(false)
                    })
            })
    })

    after(() => disconnect())
})