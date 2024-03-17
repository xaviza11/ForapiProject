require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const retrieveOrders = require('./retrieveOrders')
const { expect } = require('chai')
const { Users, } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, FormatError }
} = require('com')
const { game, usersUsers } = require('../models/schemas')

describe('retrieveOrders', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

    //!This logic is not used in app
    /*// Tests that orders are returned in reverse chronological order and store information is added to each order for a user with a valid userId who has orders and associated stores. 
    it("test_happy_path_user_with_valid_id_has_orders_and_stores", () => {
        const userId = "validUserId";
        return retrieveOrders(userId)
            .then(result => {
                expect(result).to.have.property('orders');
                expect(result.orders).to.be.an('array');
                expect(result.orders[0]).to.have.property('storeArray');
                expect(result.orders[0].storeArray).to.be.an('array');
            })
    });

    // Tests that orders are returned in reverse chronological order and store information is added to each order for a store with a valid userId who has orders and associated stores. 
    it("test_happy_path_store_with_valid_id_has_orders_and_stores", () => {
        const userId = "validStoreId";
        return retrieveOrders(userId)
            .then(result => {
                expect(result).to.have.property('orders');
                expect(result.orders).to.be.an('array');
                expect(result.orders[0]).to.have.property('storeArray');
                expect(result.orders[0].storeArray).to.be.an('array');
            })
    });

    // Tests that a TypeError is thrown when userId is not a string. 
    it("test_edge_case_userId_not_string", () => {
        const userId = 123;
        expect(() => retrieveOrders(userId)).to.throw(TypeError);
    });

    // Tests that a FormatError is thrown when userId is an empty string. 
    it("test_edge_case_userId_empty_string", () => {
        const userId = "";
        expect(() => retrieveOrders(userId)).to.throw(FormatError);
    });

    // Tests that orders are returned in reverse chronological order for both users and stores. 
    it("test_general_behavior_orders_returned_in_reverse_chronological_order", () => {
        const userId = "validUserId";
        return retrieveOrders(userId)
            .then(result => {
                expect(result.orders[0].date).to.be.above(result.orders[result.orders.length - 1].date);
            })
    });

    // Tests that a TypeError is thrown when a user with a valid userId has no orders. 
    it("test_edge_case_user_with_valid_id_has_no_orders", () => {
        const userId = "validUserIdWithNoOrders";
        expect(() => retrieveOrders(userId)).to.throw(TypeError);
    });

    // Tests that a TypeError is thrown when a store with a valid userId has no orders. 
    it("test_edge_case_store_with_valid_id_has_no_orders", () => {
        const userId = "validStoreIdWithNoOrders";
        expect(() => retrieveOrders(userId)).to.throw(TypeError);
    });

    // Tests that orders are returned in reverse chronological order but no store information is added to each order for a user with a valid userId who has orders but no associated stores. 
    it("test_edge_case_user_with_valid_id_has_orders_but_no_associated_stores", () => {
        const userId = "validUserIdWithOrdersButNoStores";
        return retrieveOrders(userId)
            .then(result => {
                expect(result.orders[0]).to.not.have.property('storeArray');
            })
    });

    // Tests that orders are returned in reverse chronological order but no store information is added to each order for a store with a valid userId who has orders but no associated stores. 
    it("test_edge_case_store_with_valid_id_has_orders_but_no_associated_stores", () => {
        const userId = "validStoreIdWithOrdersButNoStores";
        return retrieveOrders(userId)
            .then(result => {
                expect(result.orders[0]).to.not.have.property('storeArray');
            })
    });

    // Tests that store information is added to each order for both users and stores. 
    it("test_general_behavior_store_information_added_to_each_order", () => {
        const userId = "validUserId";
        return retrieveOrders(userId)
            .then(result => {
                expect(result.orders[0]).to.have.property('storeArray');
                expect(result.orders[0].storeArray).to.be.an('array');
            })
    });

    // Tests that appropriate error handling is in place for database queries. 
    it("test_important_error_handling_for_database_queries", () => {
        const userId = "invalidUserId";
        expect(() => retrieveOrders(userId)).to.throw(TypeError);
    });

    // Tests that appropriate error handling is in place for missing or invalid data. 
    it("test_important_error_handling_for_missing_or_invalid_data", () => {
        const userId = null;
        expect(() => retrieveOrders(userId)).to.throw(TypeError);
    });
    after(() => disconnect())*/
})