require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const updateItem = require('./updateItem')
const { expect } = require('chai')
const { } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { tags } = require('../models/schemas')

describe('updateItem', () => {
    before(() => connect(process.env.TEST_MONGODB_URL));

    /**
     * @use This logic is used for update one item @use
     * @param {string}  id The id of the item
     * @param {string} title The new title of the item
     * @param {string} description The new description
     * @param {number} price The new price
     * @param {string} collection The collection of the item
     * @param {string} itemList The id of the itemList
     * @param {number} secretPass The secretPass for validate the number
     * @param {string} token The token of the user
     */

    // Tests that the function throws a TypeError when token is not a string
    it("test_token_not_string", async () => {
        try {
            await updateItem('23', 'Title', 'Description', 123, 'furniture', 'ItemList', 12, 12)
        } catch (error) {
            expect(error.message).to.be.equal('TypeError: El token no es una string');
        }
    });

    // Tests that the function throws a TypeError when id is not a string
    it("test_id_not_string", async () => {
        try {
            await updateItem(12, 'Title', 'Description', 123, 'furniture', 'ItemList', 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('TypeError: La id no es una string')
        }
    });

    // Tests that the function throws a TypeError when title is not a string
    it("test_title_not_string", async () => {
        try {
            await updateItem('23', 123, 'Description', 123, 'furniture', 'ItemList', 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('TypeError: El título no es una string')
        }
    });

    // Tests that the function throws a TypeError when description is not a string
    it("test_description_not_string", async () => {
        try {
            await updateItem('23', 'Title', 123, 123, 'furniture', 'ItemList', 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('TypeError: La descripción no es una string')
        }
    });

    // Tests that the function throws a TypeError when price is not a number
    it("test_price_not_number", async () => {
        try {
            await updateItem('23', 'Title', 'Description', '123', 'furniture', 'ItemList', 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('TypeError: El precio no es un número')
        }
    });

    // Tests that the function throws a TypeError when furniture is not a string
    it("test_furniture_not_string", async () => {

        try {
            await updateItem('23', 'Title', 'Description', 123, 123, 'ItemList', 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('TypeError: La colección no es una string')
        }
    });

    // Tests that the function throws a TypeError when itemList is not a string
    it("test_itemList_not_string", async () => {
        try {
            await updateItem('23', 'Title', 'Description', 123, 'furniture', 123, 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('TypeError: La id no es una string')
        }
    });

    // Tests that the function throws a LengthError when id is empty
    it("test_empty_id", async () => {
        try {
            await updateItem('', 'Title', 'Description', 123, 'furniture', 'ItemList', 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('LengthError: La id esta vacía')
        }
    });

    // Tests that the function throws a LengthError when collection is empty
    it("test_collection_empty", async () => {
        try {
            await updateItem('23', 'Title', 'sesfx', 123, '', 'ItemList', 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('LengthError: La colección esta vacía')
        }
    });

    // Tests that the function throws a LengthError when itemList is empty
    it("test_empty_itemList", async () => {
        try {
            await updateItem('23', 'Title', 'Description', 123, 'furniture', '', 12, 'Token')
        } catch (error) {
            expect(error.message).to.be.equal('LengthError: El producto no es una string')
        }
    });

    // Test that the function throw a error when token not valid
    it("test_token_not_valid", async () => {
        try {
            await updateItem('6430731684689a7a35b85cec', 'updated', 'updated', 1234, 'furniture', '65ba37c27f3f90d36257a828', 1234, '1234')
        } catch (error) {
            expect(error.message).to.include('TypeError: Cannot read properties of null')
        }
    })

    //Test that the function happy success
    it("test_updateItem_success", () => {
        return authenticate('aitor@tilla.com', '123123123', 1234)
            .then(async token => {
                const res = await updateItem('6430731684689a7a35b85cec', 'updated', 'updated', 1234, 'furniture', '65ba37c27f3f90d36257a828', 1234, token)
                expect(res).to.have.property('token')
            })
    })

    after(() => disconnect());
});

