const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')
const enablePayment = require('../logic/enablePayment')

module.exports = (req, res) => {
    try {
        const {orderId} = req.body

        const userToken = req.headers['authorization']
        const token = userToken.substring(7);

        enablePayment(orderId, token)
            .then(() => res.status(201).send())
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