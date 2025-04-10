const express = require('express');
const router = express.Router();
const { postIIRData, getIIRData } = require('../controllers/IIRController');

router.post('/IIR', postIIRData);
router.post('/getIIR', getIIRData);

module.exports = router;
