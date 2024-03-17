require('dotenv').config();

const express = require('express');
const multer = require('multer');
const path = require('path');

const jsonBodyParser = require('./utils/jsonBodyParser');
const cors = require('./utils/cors');

const uploadImageHandler = require('./handlers/uploadImageHandler');
const deleteImageHandler = require('./handlers/deleteImageHandler')

const api = express();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

api.post('/upload', uploadImageHandler);
api.post('/delete', jsonBodyParser, deleteImageHandler);

api.use('/public', express.static(path.join(__dirname, 'public')));

const { PORT } = process.env;

api.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
