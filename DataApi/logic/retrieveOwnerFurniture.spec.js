require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveOwnerFurniture = require('./retrieveOwnerFurniture')
const { expect } = require('chai')
const { Users, Search } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, TypeError }
} = require('com')
const { game, usersUsers, search } = require('../models/schemas')

describe('retrieveOwnerFurniture', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    //!This logic is never used

    after(() => disconnect())
})