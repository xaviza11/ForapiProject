require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveOneItem = require('./retrieveOneItem')
const { expect } = require('chai')
const { Users, Search } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')
const authenticare = require('./authenticateUser')

describe('retrieveOneItem', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    /**
     * @use This logic retrieve one item @use
     * @param {string}  itemId The id of the user
     * @param {string} collection The collection of the item
     * @param {number} secretPass The secretPass for validate client
     * @param {string} token The token of the user
     */

    // Tests that the function throws a TypeError when itemId not string
    it("test_itemId_not_string", () => {
        expect(() => retrieveOneItem(23, 'c', '12', 123)).to.throw(TypeError);
    });

    // Tests that the function throws a LenghtError when itemId empty. 
    it("test_itemId_empty", () => {
        expect(() => retrieveOneItem('', 'c', 123, '123')).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", () => {
        expect(() => retrieveOneItem('23', 'c', 12, 123)).to.throw(TypeError);
    });

    // Tests that the function throws a LenghtError when token empty
    it("test_token_empty", () => {
        expect(() => retrieveOneItem('23', 'c', 123, '')).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when secretPass not number
    it("test_secretPass_not_number", () => {
        expect(() => retrieveOneItem('23', '12', '123', 't')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when collection not lenght
    it("test_collection_not_string", () => {
        expect(() => retrieveOneItem('1234', 'c', 123, '1234')).to.throw(TypeError)
    })

    // Test that the function throw error when token is invalid
    it("test_token_not_valid", async () => {
        try{
            await retrieveOneItem('64bf6ae638eaf604bd542a70', 'furniture', 1234, '1234')
        }catch(error){
            expect(error.message).to.equal('No hay tiendas')
        }
    })

    // Tests that the function retrieveOneItem
    it("test_retrieveOneItem_success", async () => {
        return authenticare('aitor@tilla.com', '123123123', 1234)
        .then(async token => {
            const res = await retrieveOneItem('64bf6ae638eaf604bd542a70', 'furniture', 1234, token)
            expect(res).to.have.property('token')
        })
    })


    after(() => disconnect())
})