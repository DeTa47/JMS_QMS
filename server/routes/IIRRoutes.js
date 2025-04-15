const express = require('express');
const router = express.Router();
const { postIIRData, getIIRData, updateIIRData } = require('../controllers/IIRController');

router.post('/IIR', postIIRData);
router.post('/getIIR', getIIRData);
router.patch('/updateIIR', updateIIRData);

module.exports = router;
