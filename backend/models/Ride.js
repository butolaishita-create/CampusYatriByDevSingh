const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, required: true, trim: true },
  to: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  seatsTotal: { type: Number, required: true, min: 1, max: 8 },
  seatsAvailable: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true, maxlength: 300, default: '' },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for faster search
rideSchema.index({ from: 1 });
rideSchema.index({ to: 1 });
rideSchema.index({ date: 1 });
rideSchema.index({ status: 1 });

module.exports = mongoose.model('Ride', rideSchema);
