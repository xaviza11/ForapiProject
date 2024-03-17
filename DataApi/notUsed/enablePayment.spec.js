require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const enablePayment = require('./enablePayment')
const { expect } = require('chai')
const {} = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, FormatError }
} = require('com')

describe('enablePayments', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    it('!!!!!!!!!!!!!!!!!!!!!!!!---enable payment is not used in app---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', () => { // happy path
        debugger
        enablePayment('63e15f63d78144e9b6ecd5cf', '63cbd6b9b89c549b5bc8ab7a')
            .then(order => {
                expect(order).to.exist
                expect(order.clientPhone).to.be.equal('678901234')
                expect(order.isReady).to.be.equal(true)
            })
    })

    after(() => disconnect())
})