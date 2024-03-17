const updateItem = require('../logic/updateItem')
const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError} } = require('com')

module.exports = (req, res) => {
    try {
        const {id, title, description, price, collection, itemList, secretPass} = req.body

        const userToken = req.headers['authorization']
        const token = userToken.substring(7);

        updateItem(id, title, description, price, collection, itemList, secretPass, token)
            .then(response => res.json(response))
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