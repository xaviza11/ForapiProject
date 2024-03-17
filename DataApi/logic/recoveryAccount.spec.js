require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const { expect } = require('chai')
const { Users, Game, Tags, Posts, FurnitureOrders } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, LengthError, FormatError }
} = require('com')
const recoveryAccount = require('./recoveryAccount')

/**
 * @use This logic is used for recovery one account @use
 * @param {String} email The email for recovery
 * @param {number} secretPass The secret pass for validate client
 */

describe('recoveryAccount', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws a TypeError when email is not string.
    it("test_email_not_string", () => {
        const email = 123;
        const secretPass = 123
        expect(() => recoveryAccount(email, secretPass)).to.throw(TypeError);
    });

    // Tests that the function throws a LengthError when email is empty.
    it("test_email_not_length", () => {
        const email = '';
        const secretPass = 123
        expect(() => recoveryAccount(email, secretPass)).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when secretPass not number..
    it("test_secretPass_not_number", () => {
        const email = '123';
        const secretPass = '123'
        expect(() => recoveryAccount(email, secretPass)).to.throw(TypeError);
    });

    //Test that the function throws a FormatError when email has not the correct format
    it("test_email_has_incorrect_format", () => {
        const email = '123'
        const secretPass = 1234
        expect(() => recoveryAccount(email, secretPass)).to.throw(FormatError)
    })

    after(() => disconnect());
})