const express = require('express');
const { getDocumentDetails } = require('../controllers/documentController');

const router = express.Router();

router.post('/getDocumentDetails', getDocumentDetails);

module.exports = router;
