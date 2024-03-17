const { ObjectId } = require('mongodb')
const { Schema } = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    stores: {
        type: Array,
    },
    date: {
        type: Date,
        required: true
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    banDate: {
        type: Date
    },
    strikes: {
        type: Number,
        default: 0
    },
    itemsList: {
        type: ObjectId
    },
    basketId: {
        type: ObjectId
    },
    hasChat: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: 'none'
    }
})