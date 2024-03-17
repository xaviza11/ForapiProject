require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const authenticateUser = require('./authenticateUser')
const { expect } = require('chai')
const { Users, Game } = require('../models')
const { compareSync } = require('bcryptjs')
const selectedLanguage = require('../utils/languages/es.json')

const {
    errors: { ConflictError, FormatError }
} = require('com')
const { game, user } = require('../models/schemas')
const { LengthError } = require('com/errors')

/**
 * @use This logic authenticate a user @use 
 * @param {string} email The user email
 * @param {string} password The user password
 * @param {number} secretPass The pass for validate client
 */

describe('authenticateUser', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function successfully authenticates a user with a valid email and password. 
    it("test_valid_email_and_password", () => {
        return Users.findOne({ email: 'cape@rucita.com' })
            .then(match => {
                if (!match) {
                    return Users.create({ name: 'Cape Rucita', email: 'cape@rucita.com', password: '123123123', gender: 'Factory', phone: '123123123', date: new Date() })
                        .then(users => {
                            expect(users).to.exist
                            expect(users.name).to.exist
                            expect(users.email).to.exist
                            expect(users.password).to.exist
                            expect(users.gender).equal('Factory')
                        })
                } else return 
            })
    });

    // Tests that the function throws a FormatError when given an invalid email format. 
    it(" test_invalid_email_format", () => {
        const secretPass = 123
        const email = "invalidemail";
        const password = "password123";
        expect(() => authenticateUser(email, password, secretPass)).throw(FormatError);
    });

    // Tests that the function throws a LengthError when given a password with length less than 8. 
    it("test_password_length_less_than_8", () => {
        const secretPass = 123
        const email = "test@example.com";
        const password = "pass123";
        expect(() => authenticateUser(email, password, secretPass)).throw(LengthError);
    });

    // Tests that the function throws a TypeError when given an email that is not a string. 
    it("test_email_not_string", () => {
        const secretPass = 123
        const email = 123;
        const password = "password123";
        expect(() => authenticateUser(email, password, secretPass)).throw(TypeError);
    });

    // Tests that the function throws a TypeError when given a password that is not a string. 
    it("test_password_not_string", () => {
        const secretPass = 123
        const email = "test@example.com";
        const password = 123;
        expect(() => authenticateUser(email, password, secretPass)).throw(TypeError);
    });

    // Tests that the function throws the correct error types. 
    it("test_throw_correct_error_types", () => {
        const secretPass = 123
        expect(() => authenticateUser(123, 'password123', secretPass)).throw(TypeError)
    })

    // Tests that a password containing spaces throws a FormatError. 
    it("test_password_contains_spaces", () => {
        const secretPass = 123
        expect(() => authenticateUser('test@test.com', 'pa ssw ord 123', secretPass)).throw(FormatError)
    })

    // Tests that the function throws unexpected error
    it("test_unexpected_error", async () => {
        const secretPass = 123
        const email = 'perico@palotes.com';
        const password = 'password123';
    
        // Force an unexpected error by passing incorrect arguments to the function
        try {
            await authenticateUser(email, password, secretPass);
        } catch (error) {
            // Expecting an UnexpectedError to be thrown
            expect(error.message).to.include(selectedLanguage.userNotExist);
        }
    });

    // Tests if authenticate user succes
    if("test_autenticathe_user_success", () => {
        expect(() => authenticateUser('store1@store1.com', '123123123', 1234)).to.have.property('token')
    })
    
    after(() => disconnect());
})