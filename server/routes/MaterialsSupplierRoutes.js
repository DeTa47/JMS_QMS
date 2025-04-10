const express = require('express');
const router = express.Router();
const { createMaterialSupplier, getAllMaterialsAndSuppliers } = require('../controllers/MaterialsSuppliersController');

router.post('/createMaterialSupplier', createMaterialSupplier);
router.post('/getMaterialSupplier', getAllMaterialsAndSuppliers); 
module.exports = router;