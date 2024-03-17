const fs = require('fs')

function saveStores(stores) {
    const dataToStore = { stores: stores };
    const jsonData =JSON.stringify(dataToStore, null, 2); 
    fs.writeFileSync('src/stg/stores.json', jsonData, 'utf8'); 
    return
}

module.exports = saveStores