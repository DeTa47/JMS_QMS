const express = require('express');
const { createData, getManufacturingData } = require('../controllers/ManufacturingController');

const router = express.Router();

router.post('/manufacturing', createData);
router.post('/getmanufacturing', getManufacturingData);

module.exports = router;
