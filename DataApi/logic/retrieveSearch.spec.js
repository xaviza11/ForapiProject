require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveSearch = require('./retrieveSearch')
const { expect } = require('chai')
const { Users, Search } = require('../models')
const authenticate = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')

describe('retrieveSearch', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    /**
     * @use This logic retrieve the searched items @use
     * @param {string} token The token of the user
     * @param {string} id The id of the search
     * @param {string} collection The collection of the item
     * @param {number} secretPass The secret pass for validate client
     */

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", async () => {
        try {
            await retrieveSearch(23, 'c', '12', 123)
        } catch (error) {
            expect(error.message).to.equal('TypeError: El token no es una string')
        }
    });

    //Test that the function throws a LengthError when token not length
    it("test_token_empty", async () => {
        try{
            await retrieveSearch('', '123', '123', 123)
        }catch(error){
            expect(error.message).to.equal('LengthError: El token esta vacío')
        }
    })

    // Tests that the function throws a TypeError when id not string
    it("test_id_not_string", async () => {
        try {
            await retrieveSearch('23', 12, 12, 123)
        } catch (error) {
            expect(error.message).to.equal('TypeError: La id no es una string')
        }
    });

    //Test that the function throws a LengthError when id not length
    it("test_id_empty", async () => {
        try{
            await retrieveSearch('1234', '', '123', 1234)
        }catch(error){
            expect(error.message).to.equal('LengthError: La id esta vacía')
        }
    })

    // Tests that the function throws a TypeError when secretPass not number
    it("test_secretPass_not_number", async () => {
        try {
            await retrieveSearch('23', '12', '123', '123')
        } catch (error) { expect(error.message).to.equal('TypeError: La key no es un numero') }
    });

    //Test that the function throw error when token not valid
    it("test_retrieveSearch_token_not_valid", async () => {
        try{
            await retrieveSearch('1234', '65b7e72dc954d17d0b5d5367', 'furniture', 124)
        }catch(error){
            expect(error.message).to.include('NotFoundError')
        }
    })

    //Test that the funciton happy test
    it("test_retrieveSearch_success", async () => {
        return authenticate('aitor@tilla.com', '123123123', 1234)
        .then(async token => {
            const res = await retrieveSearch(token, '65b7e72dc954d17d0b5d5367', 'furniture', 124)
            expect(res).to.have.property('furniture')
        })

    })

        after(() => disconnect())
})