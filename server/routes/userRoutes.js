const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  updateProfileValidation,
  changePasswordValidation
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// All routes are protected
router.use(protect);

router.put('/profile', updateProfileValidation, validate, updateProfile);
router.put('/password', changePasswordValidation, validate, changePassword);

module.exports = router;
