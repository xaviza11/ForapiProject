const fs = require('fs');
const path = require('path');
const deleteImage = require('../logic/deleteImage')
const { errors: { FormatError, LengthError, NotFoundError, AuthError, ConflictError } } = require('com')

  module.exports = (req, res) => {
    const { url } = req.body

    try {
      deleteImage(url)
        .then(message => {
          res.json({ message })
        })
        .catch(error => {
          if (error instanceof NotFoundError)
            res.status(404).json({ error: error.message })
          else if (error instanceof AuthError)
            res.status(401).json({ error: error.message })
          else res.status(500).json({ error: error.message })
        })
    } catch (error) {
      if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
        res.status(400).json({ error: error.message })
      else res.status(500).json({ error: error.message })
    }
  }