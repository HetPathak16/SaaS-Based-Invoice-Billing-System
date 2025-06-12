const reportController= require('../controllers/reportsController');
const express =require('express');
const router =express.Router();

router.get('/summery',reportController.summary);
router.get('/monthly',reportController.monthlyReport);
router.get('/exportCSV',reportController.exportCSV);

module.exports = router;