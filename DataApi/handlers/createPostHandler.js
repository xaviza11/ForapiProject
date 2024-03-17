const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')
const createPost = require('../logic/createPost')

module.exports = (req, res) => {
    try {

        const {comment, furnitureId: furnitureId} = req.body

        const userToken = req.headers['authorization']
        const token = userToken.substring(7);

        createPost(token, comment, furnitureId)
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