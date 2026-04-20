const Ride = require('../models/Ride');

// @POST /api/rides - Create ride
const createRide = async (req, res) => {
  try {
    const { from, to, date, seatsTotal, price, description } = req.body;

    if (!from || !to || !date || !seatsTotal || price === undefined) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const ride = await Ride.create({
      driverId: req.user._id,
      from,
      to,
      date: new Date(date),
      seatsTotal,
      seatsAvailable: seatsTotal,
      price,
      description: description || ''
    });

    const populated = await Ride.findById(ride._id)
      .populate('driverId', 'name email college rating')
      .lean();

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/rides - Get all rides with filters + pagination
const getRides = async (req, res) => {
  try {
    const { from, to, date, page = 1, limit = 10, sort = 'date' } = req.query;

    const query = { status: 'active' };

    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(20, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [rides, total] = await Promise.all([
      Ride.find(query)
        .populate('driverId', 'name email college rating')
        .sort({ date: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Ride.countDocuments(query)
    ]);

    res.json({
      rides,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/rides/:id
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driverId', 'name email college rating createdAt')
      .populate('passengers', 'name email college rating')
      .lean();

    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @POST /api/rides/:id/join
const joinRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.status !== 'active') return res.status(400).json({ message: 'Ride is not active' });
    if (ride.seatsAvailable <= 0) return res.status(400).json({ message: 'No seats available' });
    if (ride.driverId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Driver cannot join own ride' });
    }
    if (ride.passengers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined this ride' });
    }

    ride.passengers.push(req.user._id);
    ride.seatsAvailable -= 1;
    await ride.save();

    const updated = await Ride.findById(ride._id)
      .populate('driverId', 'name email college rating')
      .populate('passengers', 'name email college rating')
      .lean();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @POST /api/rides/:id/leave
const leaveRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const idx = ride.passengers.indexOf(req.user._id);
    if (idx === -1) return res.status(400).json({ message: 'Not joined this ride' });

    ride.passengers.splice(idx, 1);
    ride.seatsAvailable += 1;
    await ride.save();

    res.json({ message: 'Left ride successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @DELETE /api/rides/:id
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.driverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this ride' });
    }

    ride.status = 'cancelled';
    await ride.save();

    res.json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/rides/user/:userId - User's rides
const getUserRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { driverId: req.params.userId },
        { passengers: req.params.userId }
      ]
    })
      .populate('driverId', 'name email college rating')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createRide, getRides, getRideById, joinRide, leaveRide, deleteRide, getUserRides };
