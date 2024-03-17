require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const updateUser = require('./updateUser')
const { expect } = require('chai')
const { } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticatheUser = require('../logic/authenticateUser')

const {
    errors: { TypeError, LengthError }
} = require('com')
const { tags } = require('../models/schemas')

describe('updateUser', () => {
    before(() => connect(process.env.TEST_MONGODB_URL));

    /**
     * @use This logic is used to update user information @use
     * @param {string} token The token of the user
     * @param {string} password The current password of the user
     * @param {string} newEmail The new email to update
     * @param {string} newPassword The new password to update
     * @param {string} newName The new name to update
     * @param {string} newPhone The new phone number to update
     * @param {number} secretPass The pass for validating the client
     */

    // Tests that the function throws a TypeError when secretPass is not a number
    it("test_secretPass_not_number", () => {
        expect(() => updateUser('Token', 'Password', 'newEmail@example.com', 'newPassword', 'NewName', '123456789', 'InvalidSecretPass')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when token is not a string
    it("test_token_not_string", () => {
        expect(() => updateUser(123, 'Password', 'newEmail@example.com', 'newPassword', 'NewName', '123456789', 12)).to.throw(TypeError);
    });

    // Tests that the function throws a LengthError when token is empty
    it("test_empty_token", () => {
        expect(() => updateUser('', 'Password', 'newEmail@example.com', 'newPassword', 'NewName', '123456789', 12)).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when email is not a string
    it("test_email_not_string", () => {
        expect(() => updateUser('Token', 123, 'Password', 'newEmail@example.com', 'newPassword', 'NewName', '123456789', 12)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when password is not a string
    it("test_password_not_string", () => {
        expect(() => updateUser('Token', 123, 'newEmail@example.com', 'newPassword', 'NewName', '123456789', 12)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when newName is not a string
    it("test_newName_not_string", () => {
        expect(() => updateUser('Token', 'Password', 'newEmail@example.com', 'newPassword', 123, '123456789', 12)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when newEmail is not a string
    it("test_newEmail_not_string", () => {
        expect(() => updateUser('Token', 'Password', 123, 'newPassword', 'NewName', '123456789', 12)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when newPassword is not a string
    it("test_newPassword_not_string", () => {
        expect(() => updateUser('Token', 'Password', 'newEmail@example.com', 123, 'NewName', '123456789', 12)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when newPhone is not a string
    it("test_newPhone_not_string", () => {
        expect(() => updateUser('Token', 'Password', 'newEmail@example.com', 'newPassword', 'NewName', 123, 12)).to.throw(TypeError);
    });

    // Test that the function throw error when token is invalid
    it("token_not_valid", async () => {
        try {
            updateUser('12345', '123123123', "tilla@aitor.com", "321321321", "tilla", '321321321', 123123)
        }catch(error){
            expect(error.message).to.include('TypeError: Cannot read properties of nul')
        }
    })

    // Tests that the function update users
    it("user_has_been_updated", () => {

        return authenticatheUser("aitor@tilla.com", '123123123', 1234)
            .then(async token => {
                updateUser(token, '123123123', "tilla@aitor.com", "321321321", "tilla", '321321321', 123123)
                    .then(token2 => {
                        return Users.find({ email: 'tilla@aitor.com' })
                            .then(user => {
                                expect(user.name).to.equal('tilla')
                                expect(user.phone).to.equal('321321321')
                                expect(user.email).to.equal('tilla@aitor.com')

                                return authenticatheUser("tilla@aitor.com", "321321321", 1234321)
                                    .then(res => {
                                        expect(res).to.have.property('token')
                                        return updateUser(token, '321321321', "aitor@tilla.com", "123123123", "aitor", '123123123', 123123)
                                    })
                            })
                    })
            })
    })

    after(() => disconnect());
});
