const fs = require('fs')
const crypto = require('crypto')

function encrypteUser(value) {

    const secretKey = 'URsCOQyOwPec706';

    const dataToStore = value
    
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedData = cipher.update(JSON.stringify(dataToStore), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    
    fs.writeFileSync('src/stg/user.csv', encryptedData);
}

module.exports = encrypteUser