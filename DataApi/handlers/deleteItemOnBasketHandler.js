const deleteItemOnBasket = require("../logic/deleteItemOnBasket")

const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')

module.exports = (req, res) => {
    
    try {
        
        const {id, index, secretPass} = req.body

        const userToken = req.headers['authorization']
        const token = userToken.substring(7);

        deleteItemOnBasket(id, index, secretPass, token)
            .then(result => res.json(result))
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