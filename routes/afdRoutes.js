const express = require('express');
const router = express.Router();
const afdController = require('../controllers/afd.controller/afd.controller');

router.post('/download671', afdController.download671);
router.post('/download1510', afdController.download671);

module.exports = router;
