const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')
const createSearch = require('../logic/createSearch')

module.exports = (req, res) => {
    try {
        const {tagsSearchValue, index, latValue, lonValue, sliderValue, accValue, collection, secretPass} = req.body

        const userToken = req.headers['authorization']
        const token = userToken.substring(7);

        createSearch( token, tagsSearchValue, index, latValue, lonValue, sliderValue, accValue, collection, secretPass)
            .then(search => res.json(search))
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