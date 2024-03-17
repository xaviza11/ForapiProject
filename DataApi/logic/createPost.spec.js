require('dotenv').config()

const { connect, disconnect } = require('mongoose')
const createPost = require('./createPost')
const { expect } = require('chai')
const { Users, Game, Tags, Posts } = require('../models')
const { compareSync } = require('bcryptjs')

const {
    errors: { ConflictError, NotFoundError, TypeError }
} = require('com')
const { LengthError } = require('com/errors')

/**
 * @use This logic create a new post @use
 * @param {string} userId The userId for create the post
 * @param {string} comment The comment of the post
 * @param {String} furnitureId The furniture id for input reference
 */

describe('createPost', () => {
    before(() => connect(process.env.TEST_MONGODB_URL))

 // Tests that the function creates a post with valid input values. 
    it('test_happy_path_valid_input', () => {
        return Posts.create({ userName: '63cbd6b9b89c549b5bc8ab7a' , comment: 'this is the first post', furnitureId: '63cfaf7d8714c8fdfb403fed', date: new Date() })
            .then(post => {
                expect(post).to.exist
                expect(post.userName).to.be.equal('63cbd6b9b89c549b5bc8ab7a')
                expect(post.comment).to.be.equal('this is the first post')
                expect(post.date).to.exist
            })
    })

    // Tests that the function throws a LengthError when userId empty. 
    it("test_userId_empty", () => {
        const userId = "";
        const comment = "This is a test comment";
        const furnitureId = "987654321";
        expect(() => createPost(userId, comment, furnitureId)).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when any of the input values is not a string. 
    it("test_userId_non_string", () => {
        const userId = 123456789;
        const comment = "This is a test comment";
        const furnitureId = "987654321";
        expect(() => createPost(userId, comment, furnitureId)).to.throw(TypeError);
    });

    // Tests that the function throws a LengthError when comment is an empty string. 
    it("test_comment_empty", () => {
        const userId = "123456789";
        const comment = "";
        const furnitureId = "987654321";
        expect(() => createPost(userId, comment, furnitureId)).to.throw(LengthError);
    });

    // Tests that the function throws a LengthError when furnitureId is an empty string. 
    it("test_furnitureId_empty", () => {
        const userId = "123456789";
        const comment = "This is a test comment";
        const furnitureId = "";
        expect(() => createPost(userId, comment, furnitureId)).to.throw(LengthError);
    });

    // Tests that the function throws a TypeError when comment is not a string. 
    it("test_comment_non_string_comment", () => {
        const userId = "123456789";
        const comment = 123456789;
        const furnitureId = "987654321";
        expect(() => createPost(userId, comment, furnitureId)).to.throw(TypeError);
    });

    // Tests that the function throws a TypeError when furnitureId is not a string. 
    it("test_furnitureId_non_string_furnitureId", () => {
        const userId = "123456789";
        const comment = "This is a test comment";
        const furnitureId = 987654321;
        expect(() => createPost(userId, comment, furnitureId)).to.throw(TypeError);
    });

    // Tests that createPost happy test
    it("test_createPost_success", async () => {

        const userId = "643fac37a4f55db3b835f231"
        const comment = "comment"
        const furnitureId = "6430731684689a7a35b85cec"

        const res = await createPost(userId, comment, furnitureId)
        expect(res).to.equal('post created')

    })
    after(() => disconnect())
})