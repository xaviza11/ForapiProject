require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveLikes = require('./retrieveLikes')
const { expect } = require('chai')
const { Users, Search } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')

describe('retrieveLikes', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    /**
     * @use This logic is used to retrieve a list of furniture when user liked them before @use
     * @param {string} token The token of the user
     * @param {number} secretPass The secretPass for validate client
     */

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", () => {
        expect(() => retrieveLikes(12, 123)).to.throw(TypeError);
    });

    // Tests that the function throws a LenghtError when token empty
    it("test_token_not_length", () => {
        expect(() => retrieveLikes('', 123)).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when secretPass not number
    it("test_secretPass_not_number", () => {
        expect(() => retrieveLikes('12', '123')).to.throw(TypeError);
    });

    // Test that the function throw error when token not valid
    it("test_retrieveLikes_success", async () => {
        try {
            await retrieveLikes('12312323', 1234)
        } catch (error) {
            expect(error.message).to.include('TypeError: Cannot read properties of null')
        }
    })


    //Happy test
    it("test_retrieveLikes_success", () => {
        return authenticate('aitor@tilla.com', '123123123', 1234)
            .then(async token => {

                const res = await retrieveLikes(token, 1234)

                expect(res).to.have.property('token')
            })
    })

    after(() => disconnect())
})