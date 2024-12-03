const express = require('express');
const router = express.Router();
const wokeup = require('../controllers/wokeup.controller');

router.get('/status', wokeup.wokeup);


module.exports = router;
