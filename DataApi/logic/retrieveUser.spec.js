require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveUser = require('./retrieveUser')
const { expect } = require('chai')
const { Users, Game } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticateUser = require('../logic/authenticateUser')

const {
    errors: { ConflictError,  TypeError, UnexpectedError }
} = require('com')
const { game, usersUsers } = require('../models/schemas')
const { LengthError } = require('com/errors')

/**
 * @use This logics retrieve the token and the user data when the user login. @use
 * @param {string} token The token of the user
 * @param {number} secretPass The pass for validate client
 */

describe('retrieveUser', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that retrieveUser throws a TypeError when given an empty string as userId. 
    it("test_token_empty", () => {
        expect(() => retrieveUser('', 123)).to.throw(LengthError)
    })

    // Tests that retrieveUser throws a TypeError when given a non-string value as userId. 
    it("test_token_not_string", () => {
        expect(() => retrieveUser(123, 123)).to.throw(TypeError)
    })

    // Tests that retrieveUser throws a TypeError when given a null value as userId. 
    it("test_token_null", () => {
        expect(() => retrieveUser(null, 123)).to.throw(TypeError)
    })

    // Test that retrieveUser throws a Error when token not valid
    it("test_retrieveUser_token_not_valid", async () => {
        try{
            await retrieveUser('123412', 1234)
        }catch(error){
            expect(error.message).to.include('TypeError: Cannot read properties of null')
        }
    })

    // Tests that retrieveUser success
    it("test_retrieveUser_success", () => {
        return authenticateUser('aitor@tilla.com', '123123123', 1234)
        .then(async token => {

            const res = await retrieveUser(token, 1234)
            expect(res).to.have.property('user')
            expect(res).to.have.property('token')
            expect(res).to.have.property('stores')
            expect(res).to.have.property('itemsList')
        })
    })

    after(() => disconnect())
})