const express = require('express');
const router = express.Router();
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.get('/machine/:machineId', getReviews);
router.get('/booking/:bookingId', getReview);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
