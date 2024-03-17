require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const updateProps = require('./updateProps')
const { expect } = require('chai')
const { } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticateUser = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { tags } = require('../models/schemas')

describe('updateProps', () => {
    before(() => connect(process.env.TEST_MONGODB_URL));

    /**
   * @use This logic is used for update the props of one item @use
   * @param {string}  id The id of the item
   * @param {Array} props The props of the item
   * @param {string} collection The collection of the item
   * @param {number} secretPass The pass for validate client
   * @param {string} token The token of the user
   */

    // Tests that the function throws a TypeError when token is not a string
    it("test_token_not_string", () => {
        expect(() => updateProps('id', ['123'], 'collection', 1234, 1234)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when secretPass is not a number
    it("test_secretPass_not_number", () => {
        expect(() => updateProps('id', ['123'], 'collection', '1234', 'token')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when id is not a string
    it("test_id_not_string", () => {
        expect(() => updateProps(123, ['123'], 'collection', 1234, 'token')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when collection is not a string
    it("test_collection_not_string", () => {
        expect(() => updateProps('id', ['123'], 8979, 1234, 'token')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when props is not an array
    it("test_props_not_array", () => {
        expect(() => updateProps('id', 654, 'collection', 1234, 'token')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when secretPass is not valid
    it("test_invalid_secretPass", () => {
        expect(() => updateProps('id', ['123'], 'collection', null, 'token')).to.throw(TypeError);
    });

    // Test that the function throws a LengthError when collection empty
    it("test_collection_not_length", () => {
        expect(() => updateProps('id', ['123'], '', 1234, 'token').to.throw(LengthError))
    })

    // Test that the function throws LengthError when collection empty
    it("test_id_not_length", () => {
        expect(() => updateProps('', ['123'], '1234', 1234, 'token')).to.throw(LengthError)
    })

    // Test that the function throws LengthError when token
    it("test_token_length", () => {
        expect(() => updateProps('id', ['123'], '1234', 1234, '')).to.throw(LengthError)
    })

    // Test that the function throws error when token not valid
    it("test_token_not_valid", async () => {
        try {
            await updateProps('id', ['123'], 'collection', 1234, 'token')
        } catch (error) {
            expect(error.message).to.include('TypeError: Cannot read properties of null')
        }
    })

    // Test that the function happy test
    it("test_updateProps_success", () => {
        return authenticateUser('lasenia@zonamobel.com', '123123123', 1234)
        .then(async token => {
                const res = await updateProps('64c7dd71b64103c0b084f688', ['123'], 'furniture', 1234, token)
                expect(res).to.be.a('string')
        })
    })

    after(() => disconnect());
});
