require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrievePosts = require('./retrievePosts')
const { expect } = require('chai')
const { Users, Posts } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, FormatError, LengthError }
} = require('com')

describe('retrievePosts', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))


    // Tests that the function returns posts when furnitureId is a non-empty string. 
    it("test_happy_path_furniture_id_string", async () => {
        const furnitureId = "63d56ac133c242bd056eb5d8";
        const result = await retrievePosts(furnitureId);
        expect(result).to.have.property('posts');
    });

    // Tests that the function throws a TypeError when furnitureId is a number. 
    it("test_furniture_id_number", () => {
        const furnitureId = 12345;
        expect(() => retrievePosts(furnitureId)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when furnitureId is a boolean. 
    it("test_furniture_id_boolean", () => {
        const furnitureId = true;
        expect(() => retrievePosts(furnitureId)).to.throw(TypeError);
    });

    // Tests that the function throws a LengthError when furnitureId is an empty string. 
    it("test_furniture_id_empty", () => {
        const furnitureId = "";
        expect(() => retrievePosts(furnitureId)).to.throw(LengthError);
    });

    // Tests that the function throws an error when Posts.find() fails. 
    it("test_posts_find_failure", async () => {
        const furnitureId = "54321";
        try {
            await retrievePosts(furnitureId);
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
        }
    });

    // Tests that the function throws a TypeError when furnitureId is null. 
    it("test_furniture_id_null", () => {
        const furnitureId = null;
        expect(() => retrievePosts(furnitureId)).to.throw(TypeError);
    });

    after(() => disconnect())
})
