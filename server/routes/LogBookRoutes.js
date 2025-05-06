const express = require('express');
const router = express.Router();
const {getLogbooks, createLogBook, createLogBookById, getMonthlyLogbooks, getLogbookdata, insertValues, updateValues} = require('../controllers/LogBookController');

router.get('/getlogbooks', getLogbooks);
router.post('/createlogbook', createLogBook);
router.post('/createlogbookbyid', createLogBookById);
router.post('/getmonthlylogbooks', getMonthlyLogbooks);
router.post('/getlogbookdata', getLogbookdata);
router.post('/insertvalues', insertValues);
router.patch('/updatevalues', updateValues);

module.exports = router;