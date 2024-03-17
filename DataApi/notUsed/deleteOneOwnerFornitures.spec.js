/*require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const deleteOneOwnerFurniture = require('./deleteOneOwnerFurniture')
const { expect } = require('chai')
const { Users, Game, Tags, Posts } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, FormatError, TypeError }
} = require('com')

describe('deleteOwnerFurniture', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests that providing an empty string as id throws a TypeError. 
    it("test_empty_id_throws_length_error", () => {
        const id = "";
        expect(() => deleteOneOwnerFurniture(id)).to.throw(TypeError);
    });

    // Tests that providing a non-string value as id throws a TypeError. 
    it("test_non_string_id_throws_type_error", () => {
        const id = null;
        expect(() => deleteOneOwnerFurniture(id)).to.throw(TypeError);
    });


    after(() => disconnect())
})*/