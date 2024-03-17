const { RenovationTokens } = require('../models');
const { hash } = require('bcryptjs')

async function createRenovationToken(userId, renovateToken, apiKey) {

    let enabled = true

    if(typeof userId !== 'object') enabled = false
    if(typeof renovateToken !== 'string') enabled = false

    if(enabled === true){
    return hash(renovateToken, 8)
        .then(hash => {
            try {
                const currentDate = new Date();
                const expirationDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
                const updateDate = new Date(currentDate.getTime()) 
                return RenovationTokens.create({ token: hash, userId: userId, expirationDate: expirationDate, renovationDate: updateDate, apiKey: apiKey })
            } catch (error) {
                console.log(error)
            }
        })
    }else return 'error'
}

module.exports = createRenovationToken