const { Schema } = require('mongoose')
const { ObjectId } = require('mongodb')

module.exports = new Schema({
    userId: {
        type: String,
        required: true
    },
    storeId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true 
    },
    messages: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    chatIsReadingUser: {
        type: Boolean,
        default: false
    },
    chatIsReadingStore: {
        type: Boolean,
        default: false
    },
    deadLine: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
    },
    storeImage: {
        type: String
    }
})