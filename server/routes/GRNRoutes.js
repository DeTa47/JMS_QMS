const express = require('express');
const router = express.Router();
const { createGRN, getGRN, getALLGrn } = require('../controllers/GRNController');

router.post('/grn', createGRN);
router.get('/getallgrn', getALLGrn);
router.post('/getgrn', getGRN);

module.exports = router;
