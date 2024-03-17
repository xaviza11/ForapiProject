const { Schema } = require('mongoose')

module.exports = new Schema({
    userId: {
        type: String,
        required: true
    },  
    items: {
        type: [Object],
    }
})