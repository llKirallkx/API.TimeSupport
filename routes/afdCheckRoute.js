const express = require('express');
const router = express.Router();
const afdCheckController = require('../controllers/afdCheck.controller/afdCheck.controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/afdCheck',  upload.single('file'), afdCheckController.afdCheck);

module.exports = router;
