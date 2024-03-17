module.exports = (req, res, next) => {
    let content = ''

    req.on('data', chunk => content += chunk.toString())

    req.on('end', () => {
        if (content.trim() === '') {
            req.body = {};
        } else {
            try {
                const body = JSON.parse(content)
                req.body = body
            } catch (error) {
                console.error('Error parsing JSON:', error)
                return res.status(400).json({ error: 'Invalid JSON format' })
            }
        }

        next()
    })
}