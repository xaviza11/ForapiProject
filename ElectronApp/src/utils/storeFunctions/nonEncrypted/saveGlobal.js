const fs = require('fs')

function saveGlobal(data) {
    const dataToStore = data;
    const jsonData = JSON.stringify(dataToStore, null, 2); 
    fs.writeFileSync('src/stg/global.json', jsonData, 'utf8'); 
}

module.exports = saveGlobal