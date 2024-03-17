require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const createOwnerFurniture = require('./createOwnerFurniture')
const { expect } = require('chai')
const { Users, Game } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, FormatError }
} = require('com')
const { game, user } = require('../models/schemas')
const { LengthError, UnexpectedError } = require('com/errors')

describe('createOwnerFurniture', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that the function throws a LengthError when given an empty string userId. 
    it("test_edge_case_empty_string", () => {
        expect(() => createOwnerFurniture('', 'Furniture store')).to.throw(LengthError)
    })

    // Tests that the function throws a TypeError when given a non-string userId. 
    it("test_edge_case_not_string", () => {
        expect(() => createOwnerFurniture(123, 'Furniture store')).to.throw(TypeError)
    })
    
    after(() => disconnect());
})