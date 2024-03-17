require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const createAdd = require('./createAdd')
const { expect } = require('chai')
const { Users, Game, Tags, Posts, Search } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, FormatError, TypeError, UnexpectedError, LengthError }
} = require('com')

/**
 * @use This logic create a new advertisement @use
 * @param {string} furnitureId The id of the furniture
 * @param {string} location The location for create the advertisement
 * @param {string} collection The collection of the addverstiment
 */

describe('createAdd', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws TypeError when furnitureId is not string. 
    it("test_furnitureId_not_string", () => {

        const furnitureId = 1
        const location = [40.2, 40.2]
        const collection = 'Furniture store'

        expect(() => createAdd(furnitureId, location, collection)).throw(TypeError)
    })

    // Tests that the function throws LengthError when furnitureID is empty 
    it("test_furnitureId_empty", () => {
        const furnitureId = ''
        const location = [40.2, 40.2]
        const collection = 'Furniture store'

        expect(() => createAdd(furnitureId, location, collection)).throw(LengthError)
    })

    // Tests that the function throws LengthError when location is empty 
    it("test_location_empty", () => {
        const furnitureId = '1'
        const location = []
        const collection = 'Furniture store'

        expect(() => createAdd(furnitureId, location, collection)).throw(LengthError)
    })

    // Tests that the function throws TypeError when collection not string
    it("test_collection_not_string", () => {
        const furnitureId = '1'
        const location = ['1234']
        const collection = 123

        expect(() => createAdd(furnitureId, location, collection)).to.throw(TypeError)
    })


    // Tests that the function throws LengthError when collection is empty
    it("test_collection_empty", () => {
        const furnitureId = '1'
        const location = ['1234']
        const collection = ''

        expect(() => createAdd(furnitureId, location, collection)).to.throw(LengthError)
    })

    after(() => disconnect());
})