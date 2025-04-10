const express = require('express');
const router = express.Router();
const { getAllTestNames } = require('../controllers/TestNameController');
const { getAllSpecificationNames } = require('../controllers/SpecificationNameController');

router.get('/getAllTestNames', getAllTestNames);
router.get('/getAllSpecificationNames', getAllSpecificationNames);

module.exports = router;