require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const addFurniture = require('./addFurniture')
const { expect } = require('chai')
const { Users, Game, Stores } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticateUser = require('../logic/authenticateUser')
const registerUser = require('../logic/registerUser')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const retrieveBasketItems = require('../logic/retrieveBasketItems')

const {
    errors: { ConflictError, FormatError }
} = require('com')
const { game, user } = require('../models/schemas')
const { LengthError, UnexpectedError } = require('com/errors')

    /**
 * @use This logic adds a new product in de data base @use
 * @param {string} title The title of the product
 * @param {string} description The description of the product
 * @param {string} reference The reference of the forniture 
 * @param {number} price The price of the product
 * @param {Array}  props The props of the product inside one array
 * @param {String} maker The fabricant of the product
 * @param {Array} img The img array of the product
 * @param {String} soldBy The id of the store.
 * @param {number} secretPass The pass for validate the client 
 * @param {string} token The token for validate the client
 * @param {string} collection The collection of the item
 */

describe('addFurniture', () => {
    before(() => connect(process.env.TEST_MONGODB_URL));

    // Tests that the function throws a TypeError when token is not a string
    it("test_token_not_string", () => {

        const price = 100
        const title = 'title'
        const description = 'description'
        const props = ['props']
        const img = ['http']
        const inventories = []
        const soldBy = 'storeId'
        const collection = 'furniture'
        const reference = 'reference'
        const secretPass = 1234
        const token = 1234
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(TypeError);
    });

    // Tests that the function throws a LengthError when token not length
    it("test_token_not_length", () => {

        const price = 100
        const title = 'title'
        const description = 'description'
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = ''
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(LengthError)
    })

    //Tests that the function throws a LengthError when title not length
    it("test_title_not_length", () => {

        const price = 100
        const title = ''
        const description = 'description'
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(LengthError)
    })

    // Tests that description throws a LengthError when not length
    it("test_description_not_length", () => {

        const price = 100
        const title = 'title'
        const description = ''
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(LengthError)
    })

    // Tests that soldBy throws a LengthError when not length
    it("test_soldBy_not_length", () => {

        const price = 100
        const title = 'title'
        const description = 'description'
        const props = []
        const img = []
        const inventories = []
        const soldBy = ''
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(LengthError)
    })

    // Tests that collection throws a LengthError when token not length
    it("test_collection_not_length", () => {

        const price = 100
        const title = ''
        const description = 'description'
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = ''
        const reference = 'reference'
        const secretPass = 1234
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(LengthError)
    })

    // Tests that the function throws a TypeError when secretPass is not a number
    it("test_secretPass_not_number", () => {

        const price = 100
        const title = 'title'
        const description = 'description'
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = '1234'
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when title is not a string
    it("test_title_not_string", () => {

        const price = 100
        const title = 123
        const description = 'description'
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when description is not a string
    it("test_description_not_string", () => {

        const price = 100
        const title = 'title'
        const description = 123
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when props is not an array
    it("test_props_not_array", () => {

        const price = 100
        const title = 'title'
        const description = 'description'
        const props = 'notArray'
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when img is not an array
    it("test_img_not_array", () => {

        const price = 100
        const title = 'title'
        const description = 'description'
        const props = []
        const img = 'notArray'
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = 'token'
        const currency = '€'

        expect(() => addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)).to.throw(TypeError);
    });

    // Tests that the function throws UnexpectedError when it fails
    it("test_if_throws_unexpected_error", async () => {
        const price = 100
        const title = 'title'
        const description = 'description'
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'collection'
        const reference = 'reference'
        const secretPass = 1234
        const token = '1234'
        const currency = '€'

        try {
            await addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)
        } catch (error) {
            expect(error.message).to.equal('UnexpectedError: Collection not exist')
        }
    })

    // Tests that the function happy test
    it("test_if_furniture_is_added", async () => {

        const price = 100
        const title = 'title'
        const description = 'description'
        const props = []
        const img = []
        const inventories = []
        const soldBy = 'soldBy'
        const collection = 'furniture'
        const reference = 'reference'
        const secretPass = 1234
        const currency = '€'

        return authenticateUser('lasenia@zonamobel.com', '123123123', 1234)
            .then(async token => {

                const result = await addFurniture(price, title, description, props, img, inventories, soldBy, collection, reference, secretPass, token, currency)

                const res = await retrieveBasketItems('6548f746826eb8533e791070', token, 1234)

                expect(result).to.have.property('token')
                expect(res.items).to.have.lengthOf.above(0);
            })
    })

    after(() => disconnect());
});
