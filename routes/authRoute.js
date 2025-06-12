const express =require('express');
const router =express.Router();
const auth =require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware')

router.post('/register',auth.signUp);
router.post('/login',auth.login);
router.get('/profile',authenticate,auth.profile);
router.post('/company',auth.registerCompany)
router.post('/logout',auth.logout)

module.exports =router;