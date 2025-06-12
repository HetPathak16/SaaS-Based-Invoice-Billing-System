const express =require('express');
const router =express.Router();
const adminSettingController  = require('../controllers/AdminSettingsController')
const upload = require('../middleware/upload')

router.put('/company/:id',adminSettingController.UpdateCompanyInfo)
router.get('/company',adminSettingController.GetCompanySetting)
router.post('/logo', upload.single('logo'), adminSettingController.uploadCompanyLogo);

module.exports = router;