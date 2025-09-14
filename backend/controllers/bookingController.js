const asyncHandler = require("express-async-handler");
const Booking = require("../models/booking");
const Machine = require("../models/machine");
const User = require("../models/user");

/**
 * @desc Get all bookings (farmer or owner)
 * @route GET /api/booking/all?role=farmer&id=USERID
 * @access Private
 */
const getBookings = asyncHandler(async (req, res) => {
  const { role, id } = req.query;

const farmer = await User.findById(req.user.id);
  const farmerCode = farmer?.farmerCode || "";

  let filter = {};
  if (role === "farmer") filter.userId = id;
  else if (role === "owner") filter.ownerId = id;
  else return res.status(401).json({ message: "Unauthorized" });

  const bookings = await Booking.find(filter)
    .populate("machineId")
    .populate("ownerId")
    .populate("userId");

  res.status(200).json({ message: "Success", bookings });
});

/**
 * @desc Get single booking
 * @route GET /api/booking/:id
 * @access Private
 */
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("machineId")
    .populate("ownerId")
    .populate("userId");

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.status(200).json({ message: "Success", booking });
});

/**
 * @desc Create new booking (farmer)
 * @route POST /api/booking
 * @access Private
 */
const createBooking = asyncHandler(async (req, res) => {
  const { ownerId, machineId, date, startTime, endTime, amount } = req.body;

  if (!req.user || req.user.role !== "farmer") {
    return res.status(403).json({ message: "Only farmers can create bookings" });
  }

  if (!date || !startTime || !endTime || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const machine = await Machine.findById(machineId);
  if (machine && machine.ownerId.toString() === req.user.id) {
    return res.status(400).json({ message: "Owners cannot book their own machine" });
  }

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);
  const totalDuration = Math.abs((end - start) / (1000 * 60 * 60));

  const farmer = await User.findById(req.user.id);
  const farmerCode = farmer?.farmerCode || "";

  const booking = new Booking({
    userId: req.user.id,
    ownerId,
    machineId,
    date,
    startTime,
    endTime,
    totalDuration,
    amount,
    farmerCode, 
    status: "pending",
    paymentStatus: "unpaid",
    transactionId: null
  });

  const saved = await booking.save();
  res.status(201).json(saved);
});

/**
 * @desc Submit payment (farmer)
 * @route POST /api/booking/payment
 * @access Private
 */
const submitPayment = asyncHandler(async (req, res) => {
  const { bookingId, transactionId } = req.body;

  if (!bookingId || !transactionId) {
    return res.status(400).json({ message: "Booking ID and transaction ID are required" });
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not your booking" });
  }

  booking.transactionId = transactionId;
  booking.paymentStatus = "paid";

  await booking.save();
  res.status(200).json({ message: "Payment submitted. Waiting for owner verification." });
});

/**
 * @desc Update booking (owner accept/reject, farmer cancel)
 * @route PUT /api/booking/:id
 * @access Private
 */
const updateBooking = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // ✅ Farmer cancel (only if still pending)
  if (req.user.role === "farmer") {
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your booking" });
    }
    if (status !== "cancelled") {
      return res.status(400).json({ message: "Invalid action" });
    }
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel after accepted/rejected" });
    }

    booking.status = "cancelled";
    const updated = await booking.save();
    return res.status(200).json({
      message: "Booking cancelled (Return initiated within 7 days)",
      booking: updated
    });
  }

  // ✅ Owner accept/reject
  if (req.user.role === "owner") {
    if (booking.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner can update this booking" });
    }
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    booking.status = status;

    if (status === "rejected") {
      booking.paymentStatus = "unpaid";
    }

    const updated = await booking.save();
    return res.status(200).json({
      message: `Booking ${status}`,
      booking: updated
    });
  }

  return res.status(403).json({ message: "Not allowed" });
});

/**
 * @desc Delete booking
 * @route DELETE /api/booking/:id
 * @access Private
 */
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  await booking.deleteOne();
  res.status(200).json({ message: "Booking deleted" });
});

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  submitPayment,
  updateBooking,
  deleteBooking
};
