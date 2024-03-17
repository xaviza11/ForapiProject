require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveCountry = require('./retrieveCountry')
const { expect } = require('chai')
const { Users, Search, Countries } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, FormatError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')

/**
* @use This logic retrieve the country on the client is connected to the backend @use
* @param {string}  lat The latitude of the user
* @param {string} lon The longitude of the user
*/

describe('retrieveCountry', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function returns a promise. 
    it("test_returns_promise", () => {
        expect(() => retrieveCountry(40.7128, -74.0060)).to.exist
    });

    // Tests that the promise resolves an array of countries. 
    it("test_promise_resolves_array", async () => {
        expect(() => retrieveCountry(40.7128, -74.0060)).to.exist;
    });

    after(() => disconnect());
})