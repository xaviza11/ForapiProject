const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env
const { RenovationTokens, Users, Bans } = require('../models');
const createRenovationToken = require('./createRenovationToken');

module.exports = (req, res, next) => {

    try {

        const { headers: { authorization } } = req

        const token = authorization.substring(7)

        const decodedToken = jwt.decode(token, JWT_SECRET);

        const payload = { sub: decodedToken.sub }

        //Update de los datos
        return RenovationTokens.findOneAndUpdate({ userId: decodedToken.sub }, { $inc: { requests: 1, updatesNumber: 1 } })
            .then(response => {
                const currentDate = new Date()
                if (response) {
                    if (response.updatesNumber < REQUESTS_LIMIT_MINUTES) {
                        console.log('uno: ', currentDate)
                        console.log('dos: ', response.renovationDate)
                        if (currentDate - response.renovationDate >= 60000) {
                            //Reset cada minuto
                            return RenovationTokens.findOneAndUpdate({ userId: decodedToken.sub }, { updatesNumber: 0, renovationDate: currentDate })
                                .then(() => {
                                    next()
                                })
                        }
                    }
                    else {
                        return RenovationTokens.findByIdAndDelete(response._id)
                            .then(() => {
                                return Users.findByIdAndUpdate({ _id: decodedToken.sub }, { isBanned: false, banDate: currentDate })
                                    .then(() => {
                                        return Bans.findOneAndUpdate({}, { $push: { users: decodedToken.sub } })
                                            .then(() => {
                                                return res.status(403).json({ error: 'request limit' })
                                            })
                                    })
                            })
                    }
                    if (response.requests > REQUESTS_LIMIT)
                        return Users.findByIdAndUpdate({ _id: decodedToken.sub }, { isBanned: false, banDate: currentDate })
                            .then(() => {
                                return Bans.findOneAndUpdate({}, { $push: { users: decodedToken.sub } })
                                    .then(() => {
                                        return res.status(403).json({ error: 'request limit' })
                                    })
                            })

                    else {
                        if (currentDate > response.expirationDate) {
                            return RenovationTokens.findByIdAndDelete(response._id)
                                .then(() => {
                                    const token = jwt.sign(payload, JWT_SECRET_RENOVATE, { expiresIn: JWT_RENOVATION })
                                    createRenovationToken(decodedToken.sub, token)
                                    next()
                                })
                        } else next()
                    }
                } else {
                    const token = jwt.sign(payload, JWT_SECRET_RENOVATE, { expiresIn: JWT_RENOVATION })
                    createRenovationToken(decodedToken.sub, token)
                    next()
                }
            })

    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}