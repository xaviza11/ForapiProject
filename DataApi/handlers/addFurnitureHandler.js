const addFurniture = require('../logic/addFurniture')
const jwt = require('jsonwebtoken')
const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')
const { JWT_SECRET, JWT_EXPIRATION } = process.env

module.exports = (req, res) => {
    
    const {price, title, description, props, images, inventories, soldBy, collection, reference, secretPass, currency} = req.body

    const userToken = req.headers['authorization']
    const token = userToken.substring(7);

    try {
        addFurniture(price, title, description, props, images, inventories, soldBy, collection, reference, secretPass, token, currency )
            .then(furniture => {
                res.json({ furniture })
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