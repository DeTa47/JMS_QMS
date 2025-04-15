const express = require('express');
const router = express.Router();
const { createGRN, getGRN, getALLGrn, updateGRN } = require('../controllers/GRNController');

router.post('/grn', createGRN);
router.get('/getallgrn', getALLGrn);
router.post('/getgrn', getGRN);
router.patch('/updategrn', updateGRN);

module.exports = router;
