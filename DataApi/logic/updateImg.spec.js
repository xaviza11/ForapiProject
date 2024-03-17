require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const updateImg = require('./updateImg')
const { expect } = require('chai')
const { Users, Search } = require('../models')
const { compareSync } = require('bcryptjs')
const authenticate = require('./authenticateUser')

const {
    errors: { ConflictError, NotFoundError, TypeError, LengthError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')


/**
 * @use This logic is used for update the images of one item @use
 * @param {string} id The id of the item
 * @param {array} images The images of the item
 * @param {string} collection The colleciton og the item
 * @param {number} secretPass The pass for validate the client
 * @param {string} token The token of the user
 */

describe('updateImg', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws a TypeError when token not string
    it("test_token_not_string", () => {
        expect(() => updateImg('23', [], 'sfdsf', 123, 12)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when id not string
    it("test_id_not_string", () => {
        expect(() => updateImg(12, [], 'sfdsf', 12, 12)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when secretPass not number
    it("test_secretPass_not_number", () => {
        expect(() => updateImg('23', [], 'sfdsf', '12', '123')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when collection not string
    it("test_collection_not_string", () => {
        expect(() => updateImg('23', [], 123, 12, '123')).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when images not array
    it("test_images_not_array", () => {
        expect(() => updateImg('23', 123, '123', 12, '123')).to.throw(TypeError);
    });

    // Tests that the function throws a LenghtError when id is empty
    it("test_empty_id", () => {
        expect(() => updateImg('', [], '123', 12, '123')).to.throw(LengthError);
    });

    // Tests that the function throws a LenghtError when collection is empty
    it("test_empty_collection", () => {
        expect(() => updateImg('123', [], '', 12, '123')).to.throw(LengthError);
    });

    // Tests that the function throws a LenghtError when token is empty
    it("test_empty_token", () => {
        expect(() => updateImg('123', [], '23', 12, '')).to.throw(LengthError);
    });

    // Test that the function throw error when token is invalid
    it("test_token_invalid", async () => {
        try{
        await updateImg('6430709684689a7a35b85ccf', ["http://image.jpg"], 'furniture', 1234, '123456')
        }catch(error){
            expect(error.message).to.include('TypeError: Cannot read properties of null')
        }
    })

    //Test that the funciton happy test
    it("test_updateImage_success", () => {
        return authenticate('aitor@tilla.com', '123123123', 1234)
        .then(async token => {
            const res = await updateImg('6430709684689a7a35b85ccf', ["http://image.jpg"], 'furniture', 1234, token)
            expect(res).to.throw('token')
        })
    })


    after(() => disconnect())
})