const { Schema } = require('mongoose')

module.exports = new Schema({
    userName: {
        type: String,
        required: true
    },
    furnitureId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})