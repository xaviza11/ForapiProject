require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const validateTags = require('./validateTags')
const { expect } = require('chai')
const { Users, Game, Tags } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, FormatError, LengthError }
} = require('com')
const { game, usersUsers, tags } = require('../models/schemas')

describe('validateTags', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))
    describe('validateTags', () => {
        before(() => connect(process.env.TEST_MONGODB_URL));

        /**
     * @use This logic validate if each word in the string exist as a tag, then update the number of searches of each tag. If it doesn't exist create a new tag @use
     *@param {string} token The token of the user
     * @param {string}  tagsSearchValue The string for search the tags on data
     * @param {object} location The location of the user with the latitude, longitude and accuracy 
     * @param {number} secretPass The secret pass for validate client
     */
        // Tests that the function throws a TypeError when token is not a string
        it("test_token_not_string", async () => {
            try {
                await validateTags(123, 'SearchValue', {}, 12)
            } catch (error) {
                expect(error.message).to.equal('TypeError: El token no es una string')
            }
        });

        // Tests that the function throws a LengthError when token is empty
        it("test_empty_token", async () => {
            try {
                await validateTags('', 'SearchValue', {}, 12)
            } catch (error) {
                expect(error.message).to.equal('LengthError: El token esta vacío')
            }
        });

        // Tests that the function throws a TypeError when secretPass is not a number
        it("test_secretPass_not_number", async () => {
            try {
                await validateTags('Token', 'SearchValue', {}, 'InvalidSecretPass')
            } catch (error) {
                expect(error.message).to.equal('TypeError: La key no es un numero')
            }
        });

        // Tests that the function throws a TypeError when tagsSearchValue is not a string
        it("test_tagsSearchValue_not_string", async () => {
            try {
                await validateTags('Token', 12, {}, 12)
            } catch (error) {
                expect(error.message).to.equal('TypeError: Los tags no son una string')
            }
        });

        // Tests that the function throws a TypeError when location is not an object or string
        it("test_location_not_object_or_string", async () => {
            try {
                await validateTags('Token', 'SearchValue', 123, 12)
            } catch (error) {
                expect(error.message).to.equal('TypeError: La localización no es un objeto')
            }
        });

        // Tests if the function success
        it("test_validateTags_success", async () => {

            return authenticate('aitor@tilla.com', '123123123', 123123123)
                .then(async token => {
                    try {
                        await validateTags(token, 'canape', { lat: 20.3404, lon: 40.3434 }, 12312)
                            .then(async () => {
                                const res = Tags.find()
                                expect(res).to.above(0)
                            })
                    } catch (error) {
                        console.log(error)
                    }
                })

        })

        after(() => disconnect());
    });

    after(() => disconnect())
})