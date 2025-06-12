const taxesController = require('../controllers/taxesController')
const {authenticate} =require('../middleware/authMiddleware')
const express =require('express');
const router =express.Router();

router.get('/',authenticate,taxesController.taxList);
router.post('/',authenticate,taxesController.createTax);
router.put('/:id',authenticate,taxesController.updateTax);
router.delete('/:id',authenticate,taxesController.deleteTax);

module.exports = router