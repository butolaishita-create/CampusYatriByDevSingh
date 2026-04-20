const express = require('express');
const router = express.Router();
const { createRide, getRides, getRideById, joinRide, leaveRide, deleteRide, getUserRides } = require('../controllers/rideController');
const { protect } = require('../middleware/auth');

router.get('/', getRides);
router.post('/', protect, createRide);
router.get('/user/:userId', protect, getUserRides);
router.get('/:id', getRideById);
router.post('/:id/join', protect, joinRide);
router.post('/:id/leave', protect, leaveRide);
router.delete('/:id', protect, deleteRide);

module.exports = router;
