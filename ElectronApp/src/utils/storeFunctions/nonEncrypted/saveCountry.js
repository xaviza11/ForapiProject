const fs = require('fs')

function saveCountry(country) {
    const dataToStore = { country: country };
    const jsonData = JSON.stringify(dataToStore, null, 2); 
    fs.writeFileSync('src/stg/country.json', jsonData, 'utf8'); 
}

module.exports = saveCountry