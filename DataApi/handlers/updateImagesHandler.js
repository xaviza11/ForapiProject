const updateImg = require('../logic/updateImg')
const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError} } = require('com')

module.exports = (req, res) => {
    try {
        const {id, images, collection, secretPass} = req.body

        const userToken = req.headers['authorization']
        const token = userToken.substring(7);

        updateImg(id, images, collection, secretPass, token)
            .then(user => res.json(user))
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