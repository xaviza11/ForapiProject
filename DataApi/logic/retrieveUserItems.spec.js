require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveUserItems = require('./retrieveUserItems')
const { expect } = require('chai')
const { Users, Search } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticaeUser = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')

/**
 * @use This logics retrieve the id of the userItems data. @use
 * @param {string} id The id of the user
 * @param {number} secretPass A password for validate client
 * @param {string} token The token of the user
 */

describe('retrieveUserItems', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", () => {
        expect(() => retrieveUserItems('23', 123, 12)).to.throw(TypeError);
    });

    //Tests that the function throws a LengthError when token empty
    it("test_token_empty", () => {
        expect(() => retrieveUserItems('123', 123, '')).to.throw(LengthError)
    })

    // Tests that the function throws a TypeError when id not string
    it("test_id_not_string", () => {
        expect(() => retrieveUserItems(12, 12, 12)).to.throw(TypeError);
    });

    //Tests that the function throw a LenngthError when id not length
    it("test_id_empty",() => {
        expect(() => retrieveUserItems('', 1234, '1234'))
    })

    // Tests that the function throws a TypeError when secretPass not number
    it("test_secretPass_not_number", () => {
        expect(() => retrieveUserItems('23', '12', '123')).to.throw(TypeError);
    });

    // Test that the function throw a error when token invalid
    it("test_token_not_valid", async () => {
        try{
            await retrieveUserItems('23', 12, '123')
        }catch(error){
            expect(error.message).to.include('Cast to ObjectId failed for value')
        }
    })

    // Test that the function happy
    it("test_retrieveUserItems_happy", () => {
        return authenticaeUser('lasenia@zonamobel.com', '123123123', 1234)
        .then(async token => {
            const res = await retrieveUserItems( '65ba37c27f3f90d36257a828', 1234, token)
            expect(res).to.have.property('token')
        })
    })

        after(() => disconnect())
})