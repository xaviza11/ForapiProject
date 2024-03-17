const { errors: { NotFoundError, AuthError } } = require('com');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const { CURRENT_URL } = process.env;

module.exports = async (file) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    const relativePath = path.join(year, month, day);
    const uploadsDirectory = path.join(__dirname, '..', 'public', 'uploads', relativePath);

    const resizedFilename = `${file.filename.split('.')[0]}.png`;
    const fullPathOriginal = path.join(uploadsDirectory, file.filename);
    const fullPathResized = path.join(uploadsDirectory, resizedFilename);

    await fs.mkdir(uploadsDirectory, { recursive: true }); 
    const resizedFileExists = await fs.access(fullPathResized)
        .then(() => true)
        .catch(() => false);

    if (resizedFileExists) {
        if (!file.filename.toLowerCase().endsWith('.png')) {
            await fs.unlink(fullPathOriginal);
        }
        return { filename: resizedFilename, path: path.join(CURRENT_URL, relativePath, resizedFilename) };
    }

    let quality = 100;
    let resizedBuffer;

    for (let i = 0; i < 3; i++) {
        const resizedBuffer = await sharp(file.path)
            .resize(600, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                position: sharp.strategy.entropy
            })
            .png({ quality })
            .toBuffer();

        if (resizedBuffer.length <= 400 * 1024) {
            break;
        }

        quality -= 1;
    }

    write()

    async function write() {
        const size = await sharp(file.path)
        if (size.length <= 400 * 1024) {
            await fs.writeFile(fullPathResized, resizedBuffer);

            await fs.unlink(fullPathOriginal);
            return { filename: resizedFilename, path: publicPath };
        }else {
            return false
        }
    }


    const publicPath = path.join(CURRENT_URL, relativePath, resizedFilename);
    return { filename: resizedFilename, path: publicPath }

};
