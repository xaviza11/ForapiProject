const retrieveStores = require('../logic/retrieveStores')
const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError} } = require('com')

module.exports = (req, res) => {

    try {
        const { userId, collection } = req

        retrieveStores(userId, collection)
            .then(data => res.json(data))
            .catch(error => {
                if (error instanceof NotFoundError)
                    res.status(404).json({ error: error.message })
                else
                    res.status(500).json({ error: error.message })
            })
    } catch (error) {
        if (error instanceof TypeError || error instanceof FormatError)
            res.status(400).json({ error: error.message })
        else
            res.status(500).json({ error: error.message })
    }
}