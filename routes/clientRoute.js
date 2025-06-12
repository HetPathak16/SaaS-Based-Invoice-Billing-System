const clientController =require('../controllers/clientController');
const express =require('express');
const router = express.Router();

router.get('/',clientController.clientsListing);
router.post('/',clientController.clientCreate);
router.get('/:id',clientController.clientDetails);
router.put('/:id',clientController.updateClient);
router.delete('/:id',clientController.deleteClient);

module.exports =router;