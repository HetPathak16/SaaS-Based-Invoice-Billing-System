const express =require('express');
const router =express.Router();
const invoiceController =require('../controllers/invoiceController');

router.post('/',invoiceController.createInvoice)
router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.listInvoices); 
router.get('/:id', invoiceController.getInvoiceDetails); 
router.put('/:id', invoiceController.updateInvoice); 
router.delete('/:id', invoiceController.deleteInvoice); 

router.get('/:id/pdf', invoiceController.downloadPdf); // Download PDF
router.post('/:id/email', invoiceController.sendInvoiceEmail); // Email PDF

module.exports = router;
