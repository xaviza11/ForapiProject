require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const { expect } = require('chai')
const { Users, Game, Tags, Posts, Search } = require('../models')
const { compareSync } = require('bcryptjs')
const createAdmin = require('../logic/createAdmin')
const retrieveUser = require('../logic/retrieveUser')
const autenticatheUser = require('../logic/retrieveUser')

const {
    errors: { ConflictError, NotFoundError, FormatError, TypeError, UnexpectedError, LengthError }
} = require('com')

/**
 * @use This logic create new admin user if don't exist one previus admin item @use
 */

describe('createAdmin', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    // Tests admin already exist
    it("test_admin_created_and_error", () => {
        return createAdmin()
        .then(() => {
            return Users.findOne({email: '01_0001@0001.com'})
            .then(adm => {
                expect(adm.gender).to.equals('adm')
                expect(adm.name).to.equals('01')
                return createAdmin()
                    .then(message => {
                        expect(message).to.equal('The admin already exists')
                    })
            })
        })
    })

    after(() => disconnect());
})