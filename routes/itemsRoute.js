const itemController =require('../controllers/itemsContoller');
const express =require('express');
const { route } = require('./authRoute');
const router =express.Router();

router.get('/',itemController.itemList);
router.post('/',itemController.createItem);
router.put('/:id',itemController.UpdateItem);
router.delete('/:id',itemController.deleteItem);
router.get('/:id',itemController.getItemDetails);


module.exports = router