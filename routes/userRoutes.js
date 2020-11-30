const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// router.post('/verifyEmail', authController.verifyEmail);
// router.patch('/confirmEmail/:token', authController.confirmEmailToken);

// router.patch('/updateMyPassword', authController.updatePassword);
// router.get('/me', userController.getMe, userController.getUser);
// router.patch('/updateMe', userController.updateMe);

// router.delete('/deleteMe', userController.deleteMe);

module.exports = router;
