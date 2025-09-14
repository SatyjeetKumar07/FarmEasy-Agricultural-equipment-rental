const asyncHandler = require('express-async-handler');
const Review = require('../models/review');

// @desc Get all reviews for a specific machine
// @route GET /api/review/machine/:machineId
// @access Private
const getReviews = asyncHandler(async (req, res) => {
  const { machineId } = req.params;

  const reviews = await Review.find({ machineId })
    .populate('bookingId')
    .populate('ownerId', '-password')
    .populate('userId', '-password')
    .populate('machineId');

  res.status(200).json({
    message: "Success",
    reviews
  });
});

// @desc Get a review by bookingId
// @route GET /api/review/booking/:bookingId
// @access Private
const getReview = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const review = await Review.findOne({ bookingId })
    .populate('bookingId')
    .populate('ownerId', '-password')
    .populate('userId', '-password')
    .populate('machineId');

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.status(200).json({
    message: "Success",
    review
  });
});

// @desc Create a review
// @route POST /api/review
// @access Private (User only)
const createReview = asyncHandler(async (req, res) => {
  const { ownerId, machineId, bookingId, comment, rating } = req.body;

  if (!comment || !rating || !machineId || !bookingId || !ownerId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newReview = new Review({
    userId: req.user.id, // logged-in user
    ownerId,
    machineId,
    bookingId,
    comment,
    rating
  });

  const createdReview = await newReview.save();

  res.status(201).json({
    message: "Success",
    createdReview
  });
});

// @desc Update a review
// @route PUT /api/review/:id
// @access Private (Only review creator)
const updateReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (review.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  if (comment) review.comment = comment;
  if (rating) review.rating = rating;

  const updatedReview = await review.save();

  res.status(200).json({
    message: "Success",
    updatedReview
  });
});

// @desc Delete a review
// @route DELETE /api/review/:id
// @access Private (Only review creator)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (review.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await review.deleteOne();

  res.status(200).json({
    message: "Review deleted"
  });
});

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
};
