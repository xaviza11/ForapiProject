const { Schema } = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    numberSearches: {
        type: Number,
        default: 1
    },  
    locations: {
        type: [Object],
        required: true
    }
})