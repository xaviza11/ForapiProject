const createAdd = require('../logic/createAdd')
const jwt = require('jsonwebtoken')
const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')

const { JWT_SECRET, JWT_EXPIRATION } = process.env

module.exports = (req, res) => {
    const {furnitureId, location, collection} = req.body

    try {
        createAdd(furnitureId, location, collection)
            .then(add => {
                res.json({ add })
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