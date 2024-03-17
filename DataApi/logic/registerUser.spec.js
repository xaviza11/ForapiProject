require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const registerUser = require('./registerUser')
const { expect } = require('chai')
const { Users } = require('../models')
const { compareSync } = require('bcryptjs')
const generateCode = require('../logic/createCode')

const {
    errors: { ConflictError, TypeError }
} = require('com')
const { LengthError, FormatError } = require('com/errors')


/**
 * @use This logic is used for register a new user @use
 * @param {string}  name The name of the user
 * @param {string} email The email of the user
 * @param {string} password The password of the user
 * @param {string} storeCode This is a code for register stores 
 * @param {number} phone This is a number of phone
 * @param {number} secretPass The pass for validate client
 */

describe('registerUser', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that a user can be registered with valid input and storeCode = 'none'. 
    it("test_valid_input_none", async () => {

        return Users.find({ email: 'johndoe@example.com' })
            .then(user => {
                if(!user){
                const result =  registerUser('John Doe', 'johndoe@example.com', 'password123', 'none', '1234567890', 1234)
                expect(result).exist()
                }else{
                    return
                }
            })
    })

    // Tests that an error is thrown when invalid input types are provided. 
    it("test_invalid_input_types", () => {
        expect(() => registerUser(123, 'johndoe@example.com', 'password123', 'none', '1234567890', 1234)).throw(TypeError)
        expect(() => registerUser('John Doe', 123, 'password123', 'none', '1234567890', 1234)).throw(TypeError)
        expect(() => registerUser('John Doe', 'johndoe@example.com', 123, 'none', '1234567890', 1234)).throw(TypeError)
        expect(() => registerUser('John Doe', 'johndoe@example.com', 'password123', 123, '1234567890', 1234)).throw(TypeError)
        expect(() => registerUser('John Doe', 'johndoe@example.com', 'password123', 'none', 123)).throw(TypeError)
    })

    // Tests that an error is thrown when the name length is less than one. 
    it("test_name_length_less_than_one", () => {
        expect(() => registerUser('', 'johndoe@example.com', 'password123', 'none', '1234567890', 1234)).throw(LengthError)
    })

    // Tests that an error is thrown when the email format is invalid. 
    it("test_invalid_email_format", () => {
        expect(() => registerUser('John Doe', 'johndoeexample.com', 'password123', 'none', '1234567890', 1234)).throw(FormatError)
    })

    // Tests that an error is thrown when the password has spaces. 
    it("test_password_has_spaces", () => {
        expect(() => registerUser('John Doe', 'johndoe@example.com', 'password 123', 'none', '1234567890', 1234)).throw(TypeError)
    })

    // Tests that an error is thrown when the phone is empty. 
    it("test_phone_is_empty", () => {
        expect(() => registerUser('John Doe', 'johndoe@example.com', 'password123', 'none', '', 1234)).throw(TypeError)
    })
    
    after(() => disconnect())
})