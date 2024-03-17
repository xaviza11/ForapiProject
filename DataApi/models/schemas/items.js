const { Schema } = require('mongoose')
const { ObjectId } = require('mongodb')

module.exports = new Schema({
    price: {
        type: Number,
    },
    props: {
        type: Array
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    numberVisits: {
        type: Number,
        default: 0
    },
    collectionName: {
        type: String,
        required: true
    },
    numberLikes: {
        type: Number,
        default: 0
    },
    soldBy: {
        type: ObjectId
    },
    tags: {
        type: Array,
        required: true
    },
    inventories: {
        type: Object,
        required: true
    },
    img: {
        type: Array
    },
    storeInfo: {
        type: Array
    },
    reference: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
})