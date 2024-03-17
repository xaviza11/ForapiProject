const { Schema } = require('mongoose')

module.exports = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    requests: {
        type: Number,
        default: 0
    },
    updatesNumber: {
        type: Number,
        default: 0
    },
    renovationDate: {
        type: Date,
        required: true
    },
    apiKey: {
        type: String
    }
})