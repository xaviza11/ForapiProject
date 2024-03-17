const { ObjectId } = require('mongodb')
const { Schema } = require('mongoose')

module.exports = new Schema({
    owner: {
        type: ObjectId,
        required: true
    },
    likes: {
        type: [{_id: false, id: ObjectId, collection: String}],
        required: true
    }
})