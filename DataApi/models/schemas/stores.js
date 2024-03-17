const { ObjectId } = require('mongodb')
const { Schema } = require('mongoose')

module.exports = new Schema({
    query: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {             //This contains the coordinates
        type: Object,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    owner: {
        type: ObjectId,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    webSide: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    totalReviews: {
        type: Number,
        required: true
    },
    reviewsData: {
        type: Array,
        required: true
    },
    workingHours: {
        type: Object,
        required: true
    },
    reviewsPerScore: {
        type: Object,
        required: true
    },
    image: {
        type: String,
        default: 'none'
    },
    //New
    enabled: {
        type: Boolean,
        default: false
    },
})