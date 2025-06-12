const paymentController = require('../controllers/paymentController');
const express =require('express');
const router =express.Router();

router.post('/:invoiceId',paymentController.recordPayment);
router.get('/:invoiceId',paymentController.getPayments);

module.exports  = router;