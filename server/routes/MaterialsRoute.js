const express = require('express');
const router = express.Router();
const {getAllMaterials} = require('../controllers/MaterialsController');

router.post('/getmaterials', getAllMaterials);

module.exports = router;
