require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const updateLikes = require('./updateLikes')
const { expect } = require('chai')
const { Users, Game, Tags } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { tags } = require('../models/schemas')

describe('updateLikes', () => {
    before(() => connect(process.env.TEST_MONGODB_URL));

    /**
     * @use This logic create or update the list of likes. @use  //! Needs to add a limit and delete the furniture when pass it
     * @param {string} token The token of the user.
     * @param {string} furnitureId The id of the furniture
     * @param {number} index The number of the likes
     * @param {number} secretPass The secretPass for validate client
     * @param {string} collection The collection of the item 
     */

    // Tests that the function throws a TypeError when secretPass is not a number
    it("test_secretPass_not_number", () => {
        expect(() => updateLikes('Token', 'FurnitureId', 1, 'InvalidSecretPass', 'Collection')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when token is not a string
    it("test_token_not_string", () => {
        expect(() => updateLikes(123, 'FurnitureId', 1, 12, 'Collection')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when furnitureId is not a string
    it("test_furnitureId_not_string", () => {
        expect(() => updateLikes('Token', 123, 1, 12, 'Collection')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when collection is not a string
    it("test_collection_not_string", () => {
        expect(() => updateLikes('Token', 'FurnitureId', 1, 12, 123)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when secretPass is invalid
    it("test_invalid_secretPass", () => {
        expect(() => updateLikes('Token', 'FurnitureId', 1, 'InvalidSecretPass', 'Collection')).to.throw(TypeError);
    });

    // Tests that the function throws a LengthError when furnitureId is empty
    it("test_empty_furnitureId", () => {
        expect(() => updateLikes('Token', '', 1, 12, 'Collection')).to.throw(LengthError);
    });

    // Tests that the function throws a LengthError when index is invalid
    it("test_invalid_index", () => {
        expect(() => updateLikes('Token', 'FurnitureId', 2, 12, 'Collection')).to.throw(LengthError);
    });

    // Tests that the function throws a LengthError when token is empty
    it("test_empty_token", () => {
        expect(() => updateLikes('', 'FurnitureId', 1, 12, 'Collection')).to.throw(LengthError);
    });

    // Tests that the function throws a LengthError when collection is empty
    it("test_empty_collection", () => {
        expect(() => updateLikes('Token', 'FurnitureId', 1, 12, '')).to.throw(LengthError);
    });

    //Test that the function happy test
    it("test_updateLikes_success", () => {
        return authenticate('aitor@tilla.com', '123123123', 12312)
            .then(async token => {
                const res = await updateLikes(token, '6430709684689a7a35b85ccf', 1, 1234, 'furniture')
                expect(res).to.have.property('token')
            })
    })

    // Test that the function throw error when invalid token
    it("test_invalid_token", async () => {
        try {
            await updateLikes('1234', '6430709684689a7a35b85ccf', -1, 1234, 'furniture')
        } catch (error) {
            expect(error.message).to.include('TypeError: Cannot read properties of null')
        }
    })

    //Test that the function happy test
    it("test_updateLikes_success", () => {
        return authenticate('aitor@tilla.com', '123123123', 12312)
            .then(async token => {
                const res = await updateLikes(token, '6430709684689a7a35b85ccf', -1, 1234, 'furniture')
                expect(res).to.have.property('token')
            })
    })

    after(() => disconnect());
});
