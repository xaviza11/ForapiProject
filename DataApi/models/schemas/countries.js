const { ObjectId } = require('mongodb')
const { Schema } = require('mongoose')

module.exports = new Schema({
    location: {             //This contains the coordinates
        type: Object,
        required: true
    },
    countryName: {            //Pass to required true
        Type: String,
    },
    language: {
        Type: String
    }
})