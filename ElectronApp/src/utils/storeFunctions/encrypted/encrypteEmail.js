const fs = require('fs')
const crypto = require('crypto')

function encrypteEmail(email) {
    const secretKey = 'URsCOQyOwPec706';

    const dataToStore = { email: email };
    
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedData = cipher.update(JSON.stringify(dataToStore), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    
    fs.writeFileSync('src/stg/email.csv', encryptedData);
}

module.exports = encrypteEmail