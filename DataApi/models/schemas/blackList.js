const { ObjectId } = require('mongodb')
const { Schema } = require('mongoose')

module.exports = new Schema({
        blackUsers: {
            type: [Object],
            required: true
        }
})