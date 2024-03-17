const { ObjectId } = require('mongodb')
const { Schema } = require('mongoose')

module.exports = new Schema({
    usersBans: {
        type: Array,
        required: true
    },
})