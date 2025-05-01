const express = require('express');
const router = express.Router();

const { getMaterialIOById, createMaterialIO, updateMaterialIO } = require('../controllers/MaterialsIOController');

router.post('/getMaterialIO', getMaterialIOById);
router.post('/createMaterialIO', createMaterialIO);
router.patch('/updateMaterialIO', updateMaterialIO);

module.exports = router;