require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveGraphicData = require('./retrieveGraphicData')
const { expect } = require('chai')
const { Users, Search } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, FormatError, LengthError, UnexpectedError }
} = require('com')

describe('retrieveGraphicData', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that retrieveGraphicData function throws a LengthError when an empty string is provided as userId. 
    it("test_empty_user_id", () => {
        const userId = "";
        const collection = 'Furniture store'
        expect(() => retrieveGraphicData(userId, collection)).to.throw(LengthError);
    });

    // Tests that retrieveGraphicData function throws a TypeError when a non-string value is provided as userId. 
    it("test_non_string_user_id", () => {
        const userId = 123;
        const collection = 'Furniture store'
        expect(() => retrieveGraphicData(userId, collection)).to.throw(TypeError);
    });

    after(() => disconnect());
})