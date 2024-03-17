const { Schema } = require('mongoose')

module.exports = new Schema({
    owner: {
        type: String,
        required: true
    },
    furniture: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    search: {
        type: [String],
        required: true
    },
    index: {
        type: Number,
        required: true
    },
})