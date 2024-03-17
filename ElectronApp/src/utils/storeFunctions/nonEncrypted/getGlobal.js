const fs = require('fs')

function getCountry() {
    try {
        const jsonData = fs.readFileSync('src/stg/global.json', 'utf8');
        const data = JSON.parse(jsonData);
        return data
    } catch (error) {
        console.error('Error al leer el archivo de correo:', error);
        return null;
    }
}

module.exports = getCountry