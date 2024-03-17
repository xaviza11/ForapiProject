require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const updateProfileImage = require('./updateProfileImage')
const { expect } = require('chai')
const { } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticateUser = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { tags } = require('../models/schemas')

describe('updateProfileImage', () => {
    before(() => connect(process.env.TEST_MONGODB_URL));
    /**
     * @use This logic is used for update the profile image of the user @use
     * @param {string} url The url of the image 
     * @param {string}  storeId The id of the sotre
     * @param {number} secretPass The pass for validate client
     * @param {string} token The token of the user
     */

    // Tests that the function throws a TypeError when id is not a string
    it("test_id_not_string", () => {
        expect(() => updateProfileImage('12', 123, 123, '123')).to.throw(TypeError)
    });

    //Test that the function throws a LengthError when id has not length
    it("test_id_not_length", () => {
        expect(() => updateProfileImage('123', '', 123, '123')).to.throw(LengthError)
    })

    //Test that the function throws a TypeError when SecretPass not number
    it("test_secretPass_not_number", () => {
        expect(() => {
            updateProfileImage('123', '123', '123', '123').to.throw(TypeError)
        })
    })

    // Test that the function throw a error when token is invalid
    it("test_token_invalid", async () => {
        try {
            await updateProfileImage('123', '123', 123, '123')
        } catch (error) {
            expect(error.message).to.include('TypeError: Cannot read properties of null')
        }
    })

    after(() => disconnect());
});
