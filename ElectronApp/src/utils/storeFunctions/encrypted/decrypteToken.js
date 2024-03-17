const fs = require('fs')
const crypto = require('crypto')

function decrypteToken() {
    const secretKey = 'URsCOQyOwPec706';
    const rawData = fs.readFileSync('src/stg/key.csv', 'utf8');
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decryptedData = decipher.update(rawData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return JSON.parse(decryptedData);
}

module.exports = decrypteToken