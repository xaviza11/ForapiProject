const { ObjectId } = require('mongodb')
const { Schema } = require('mongoose')

module.exports = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    items: {
        type: Array,
    }
})