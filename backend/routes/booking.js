const express = require("express");
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  submitPayment,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);

router.get("/all", getBookings);
router.get("/:id", getBooking);
router.post("/", createBooking);
router.post("/payment", submitPayment);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
