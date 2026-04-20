const express = require('express');
const router = express.Router();
const { getUserById, updateProfile, rateUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/:id', getUserById);
router.put('/profile', protect, updateProfile);
router.post('/:id/rate', protect, rateUser);

module.exports = router;
