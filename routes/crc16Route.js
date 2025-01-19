const express = require('express');
const router = express.Router();
const crcController = require('../controllers/crc.controller/crc.controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/upload', upload.single('file'), crcController.generateCrc);

module.exports = router;
