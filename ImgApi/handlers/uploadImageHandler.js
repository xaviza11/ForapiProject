const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid'); 
const updateImage = require('../logic/updateImage'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads');

    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    const datePath = path.join(uploadPath, year, month, day);

    if (!fs.existsSync(datePath)) {
      fs.mkdirSync(datePath, { recursive: true });
    }

    cb(null, datePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuid.v4();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, 
  },
});

module.exports = (req, res) => {
  upload.single('photo')(req, res, async (err) => {

    console.log(req)

    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'El tamaño de la imagen supera el límite permitido' });
      }
      return res.status(400).json({ error: 'Error al subir la imagen' });
    }

    try {
      const processedImage = await updateImage(req.file);
      const url = processedImage.path  

      return res.json({ url });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};
