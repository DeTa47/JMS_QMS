const express = require('express');
const router = express.Router();
const {getLogbooks} = require('../controllers/LogBookController');

router.get('/getlogbooks', getLogbooks);

module.exports = router;