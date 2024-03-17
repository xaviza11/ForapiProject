const fs = require('fs')
const crypto = require('crypto')

function encrypteItemsList(itemsListId) {
    const secretKey = 'URsCOQyOwPec706';

    const dataToStore = { itemsListId: itemsListId };
    
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedData = cipher.update(JSON.stringify(dataToStore), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    
    fs.writeFileSync('src/stg/itemsList.csv', encryptedData);
}

module.exports = encrypteItemsList