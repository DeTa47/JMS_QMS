const express = require('express');
const router = express.Router();
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require('../controllers/SupplierController');

router.post('/supplier', createSupplier);
router.post('/getsupplier', getSuppliers);
router.patch('/updatesupplier', updateSupplier);
router.patch('/deletesupplier', deleteSupplier);

module.exports = router;
