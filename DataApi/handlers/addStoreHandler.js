const addStore = require('../logic/addStore')
const jwt = require('jsonwebtoken')
const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')

const { JWT_SECRET, JWT_EXPIRATION } = process.env

module.exports = (req, res) => {

    try {
        const {query, location, name, adress, postalCode,  country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email, owner, collection, secretPass, userEmail} = req.body

        const userToken = req.headers['authorization']
        const token = userToken.substring(7);

        addStore(query, location, name, adress, postalCode,  country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, email,  owner, collection, secretPass, token, userEmail)
            .then(none => {
                res.json({ none })
            })
            .catch(error => {
                if (error instanceof NotFoundError)
                    res.status(404).json({ error: error.message })
                else if (error instanceof AuthError)
                    res.status(401).json({ error: error.message })
                else
                    res.status(500).json({ error: error.message })
            })
    } catch (error) {
        if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
            res.status(400).json({ error: error.message })
        else
            res.status(500).json({ error: error.message })
    }
}