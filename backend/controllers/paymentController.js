const asyncHandler = require("express-async-handler");
const Booking = require("../models/booking");

// user submits payment
const submitPayment = asyncHandler(async (req, res) => {
  const { bookingId, transactionId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.paymentStatus = "submitted";
  booking.transactionId = transactionId; // save for owner reference
  await booking.save();

  res.json({ message: "Payment submitted. Waiting for owner verification" });
});

// owner verifies or rejects
const verifyPayment = asyncHandler(async (req, res) => {
  const { bookingId, decision } = req.body; // decision = accepted/rejected

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.paymentStatus = decision === "accepted" ? "verified" : "rejected";
  booking.status = decision === "accepted" ? "confirmed" : "rejected";
  await booking.save();

  res.json({ message: `Payment ${decision}`, booking });
});

module.exports = { submitPayment, verifyPayment };
