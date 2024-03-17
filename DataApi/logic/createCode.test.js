require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const createCode = require('./createCode')
const { expect } = require('chai')
const { Users, Game, Codes } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticateUser = require('../logic/authenticateUser')

const {
    errors: { ConflictError, FormatError }
} = require('com')
const { game, user } = require('../models/schemas')
const { LengthError } = require('com/errors')

/**
 * @use This logic create new code for register stores @use //? In the future maybe can add other kinds of codes
 * @param {string} token The token of the user
 * @param {string} email The email of the store
 * @param {string} type The type of code
 * @param {string} userType The type of user
 * @param {number} secretPass The secretPass of the user
 */
describe('createCode', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    beforeEach(() => Codes.deleteMany())

    // Tests that the function throws a TypeError when type is not string
    it("test_type_not_string", () => {
        const token = '1234'
        const email = 'alberto@alberto.cabeso'
        const type = 123
        const userType = 'store'
        const secretPass = 123

        expect(() => createCode(token, email, type, userType, secretPass)).to.throw(TypeError)
    })

    // Tests that the function throws a TypeError when userType
    it("test_userType_not_string", () => {
        const token = '1234'
        const email = 'alberto@alberto.cabeso'
        const type = 'register'
        const userType = 123
        const secretPass = 123

        expect(() => createCode(token, email, type, userType, secretPass)).to.throw(TypeError)
    })

    // Tests that the function throws a LengthError when type empty
    it("test_empty_type", () => {
        const email = 'alberto@alberto.cabeso'
        const type = ''
        const userType = 'store'
        const secretPass = 123

        return authenticateUser('aitor@tilla.com', '123123123', 1234)
            .then(token => {
                expect(() => createCode(token, email, type, userType, secretPass)).to.throw(LengthError)
            })
    })

    // Tests that the function throws a LengthError when userType is empty.
    it("test_empty_userType", () => {
        const email = 'alberto@alberto.cabeso'
        const type = 'register'
        const userType = ''
        const secretPass = 123

        return authenticateUser('aitor@tilla.com', '123123123', 1234)
            .then(token => {
                expect(() => createCode(token, email, type, userType, secretPass)).to.throw(LengthError)
            })
    })


    // Tests that the function throws a LengthError when userType is empty
    it("test_userType_not_string", () => {
        const email = 'alberto@alberto.cabeso'
        const type = 'register'
        const userType = ''
        const secretPass = 123

        return authenticateUser('aitor@tilla.com', '123123123', 1234)
        .then(token => {
            expect(() => createCode(token, email, type, userType, secretPass)).to.throw(LengthError)
        })
    })

    // Tests if the function throws error when user not admin
    it("test_user_not_admin", () => {
        return authenticateUser('aitor@tilla.com', '123123123', 1234)
            .then(async token => {
                try {
                    await createCode(token, '2@2.com', 'register', 'store', 1234)
                } catch (error) {
                    expect(error.message).to.equal('user is not admin')
                }
            })
    })

    // Tests if the code has been created
    it("code_has_been_created", () => {
        return authenticateUser('01_0001@0001.com', 'forapiAdmin4682@', 1234)
            .then(async token => {

                const res = await createCode(token, 'store1@store1.com', 'register', 'store', 1234)

                expect(res).to.have.property('res')
                expect(res).to.have.property('token')
            })
    })

    after(() => disconnect());
});

