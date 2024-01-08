const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user/profile', authMiddleware, userController.getUserProfile);
router.put('/user/profile/updateEmail', authMiddleware, userController.editUserProfileEmail);
router.put('/user/profile/updateName', authMiddleware, userController.editUserProfileName);
router.put('/user/profile/changePassword', authMiddleware, userController.changeUserPassword);
router.delete('/user/profile/delete', authMiddleware, userController.deleteUserAccount);

module.exports = router;
