const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')
const retrieveOneItem = require('../logic/retrieveOneItem')

module.exports = (req, res) => {

    try {
        const {itemId, collection, secretPass} = req.body

        const userToken = req.headers['authorization']
        const token = userToken.substring(7);

        retrieveOneItem(itemId, collection, secretPass, token)
            .then(data => res.json(data))
            .catch(error => {
                if (error instanceof ConflictError)
                    res.status(409).json({ error: error.message })
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