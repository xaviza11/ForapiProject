const authenticateUser = require('../logic/authenticateUser')
const jwt = require('jsonwebtoken')
const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')

const { JWT_SECRET, JWT_EXPIRATION, JWT_SECRET_RENOVATE, JWT_RENOVATION } = process.env

const createRenovationToken = require('../utils/createRenovationToken')
const { RenovationTokens } = require('../models')

module.exports = (req, res) => {
    const { email, password, secretPass } = req.body

    try {
        authenticateUser(email, password, secretPass)
            .then(token => {
                            res.json({ token })
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