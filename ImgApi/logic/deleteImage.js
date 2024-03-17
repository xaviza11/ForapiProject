// deleteImage.js
const fs = require('fs');
const path = require('path');

function deleteImage(url) {
    try {
        const filePath = path.join(__dirname, url);

        const resolvedPath = path.resolve(__dirname, url);
        if (!resolvedPath.startsWith(__dirname)) {
            throw new Error('Acceso no autorizado a la ruta proporcionada.');
        }

        fs.unlinkSync(filePath);
        return 'Archivo eliminado correctamente.';
    } catch (error) {
        console.error('Error al intentar eliminar el archivo:', error);
        throw error;
    }
}

module.exports = deleteImage;
