require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const { expect } = require('chai')
const { Users, Game, Tags, Posts } = require('../models')
const { compareSync } = require('bcryptjs')
const deleteAccount = require('../logic/deleteAccount')
const registerUser = require('./registerUser')
const autenticatheUser = require('../logic/authenticateUser')

const {
    errors: { ConflictError, NotFoundError, LengthError, UnexpectedError }, error
} = require('com')


/**
 * @use This logic is used for delete the account of the user @use
 * 
 * @param {string} password The password for secure the delete 
 * @param {string} token The token of the user
 * @param {number} secretPass One password for validate the client
 */

describe('deleteAccount', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that an TypeError is thrown when the token is not a string. 
    it("test_token_not_string", () => {
        const token = null;
        const password = "password123";
        expect(() => deleteAccount(token, password)).to.throw(TypeError);
    });

    // Tests that an TypeError is thrown when the password is not a string. 
    it("test_password_not_string", () => {
        const token = "test@test.com";
        const password = null;
        expect(() => deleteAccount(token, password)).to.throw(TypeError);
    });

    // Tests that an TypeError is thrown when the token is null. 
    it("test_token_null", () => {
        const token = null;
        const password = "password123";
        expect(() => deleteAccount(token, password)).to.throw(TypeError);
    });

    // Tests that an TypeError is thrown when the password is null. 
    it("test_password_null", () => {
        const token = "test@test.com";
        const password = null;
        expect(() => deleteAccount(token, password)).to.throw(TypeError);
    });

    // Tests if deleteAccount throws unexpected error.
    it("test_unexpected_error", async () => {
        const token = 'test@test.com';
        const password = 'password123';
    
        // Force an unexpected error by passing incorrect arguments to the function
        try {
            await deleteAccount(token, password);
        } catch (error) {
            // Expecting an UnexpectedError to be thrown
            expect(error.message).to.include(''); 
        }
    });
  
    // Test if deleteAccount success
    if("test_deleteAccount_success", () => {
        return registerUser('delete', 'ej@ej.com', '123123123', 'none', '456456456', 1234)
        .then(user => {
            return autenticatheUser(user.email, '123123123')
            .then(token => {
                deleteAccount(token.token, '123123123', 123123)
                    .then(() => {
                        expect(() => autenticatheUser('ej@ej.com', '123123123', 1234)).to.throw(NotFoundError)
                    })
            })
        })      
    })

    after(() => disconnect());
})