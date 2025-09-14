const express = require('express');
const router = express.Router();
const Machine = require('../models/machine');
const Booking = require('../models/booking');
const validateToken = require('../middleware/validateTokenHandler');

// 🔐 Owner must be logged in
router.use(validateToken);

// 📊 Owner Stats
router.get('/stats', async (req, res) => {
  try {
    const ownerId = req.user.id;

    const totalMachines = await Machine.countDocuments({ ownerId });
    const activeBookings = await Booking.countDocuments({ ownerId, status: 'active' });
    const totalEarningsAgg = await Booking.aggregate([
      { $match: { ownerId: req.user._id, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);

    res.json({
      totalMachines,
      activeBookings,
      totalEarnings: totalEarningsAgg[0]?.total || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 💼 Get all machines of this owner
router.get('/machines', async (req, res) => {
  try {
    const machines = await Machine.find({ ownerId: req.user.id });
    res.json(machines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch machines' });
  }
});

// 📋 Get all bookings of this owner
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.id })
      .populate('machineId userId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// 💰 Get all paid bookings (payments)
router.get('/payments', async (req, res) => {
  try {
    const paid = await Booking.find({ ownerId: req.user.id, paymentStatus: 'paid' })
      .populate('machineId userId');
    res.json(paid);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
