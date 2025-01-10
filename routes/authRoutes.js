const { Router } = require('express');
const authController = require('../controllers/authControllers')
const router = Router();

router.get('/signup',authController.handleGetSignup);
router.get('/login', authController.handleGetLogin);
router.get("/logout", authController.handleGetLogout);
router.post('/signup',authController.handlePostSignup);
router.post('/login', authController.handlePostLogin);

module.exports = router;