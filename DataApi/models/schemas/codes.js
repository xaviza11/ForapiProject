const { ObjectId } = require('mongodb')
const { Schema } = require('mongoose')

module.exports = new Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    codeType: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})