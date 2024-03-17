require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const downloadSearches = require('./downloadSearches')
const { expect } = require('chai')
const { Users, Game, Tags, Posts, Search } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, FormatError, TypeError, UnexpectedError }
} = require('com')

describe('downloadSearches', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))


    // Tests the function with valid input parameters. 
    it("test_valid_input_parameters", () => {
        const email = "01_0001@0001.com";
        const pass = "abc6768ctytct6";
        const number = 5;
        const numberB = 10;
        const numberC = 15;
        const collection = 'Furniture store'
        return Search.find({})
            .then(res => {
                if (res) {
                    return downloadSearches(email, pass, number, numberB, numberC, collection)
                        .then(result => {
                            expect(result).to.exist;
                            expect(result).to.exist;
                        })
                } else {
                    expect(TypeError)
                }
            })
    });

    // Tests the function with an empty password. 
    it("test_empty_password", () => {
        const email = "test@test.com";
        const pass = "";
        const number = 5;
        const numberB = 10;
        const numberC = 15;
        const collection = 'Furniture store'
        expect(() => downloadSearches(email, pass, number, numberB, numberC, collection)).to.throw(TypeError);
    });

    // Tests the function with invalid input types. 
    it("test_invalid_input_types", () => {
        const email = 123456789;
        const pass = "password";
        const number = "5";
        const numberB = "10";
        const numberC = "15";
        const collection = 'Furniture store'
        expect(() => downloadSearches(email, pass, number, numberB, numberC, collection)).to.throw(TypeError);
    });

    // Tests the function with a user that is not a worker. 
    it("test_user_not_worker", () => {
        const email = "cape@rucasdasditato.com";
        const pass = "password";
        const number = 5;
        const numberB = 10;
        const numberC = 15;
        const collection = 'Furniture store'
        return downloadSearches(email, pass, number, numberB, numberC, collection)
            .then(result => {
                expect(TypeError)
            })
    });

    after(() => disconnect());
})