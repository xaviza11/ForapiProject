const { Schema } = require('mongoose')
const { ObjectId } = require('mongodb')

module.exports = new Schema({

    furnitureId: {
        type: String,
        required: true
    },
    location: {
        type: Object,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
   
})