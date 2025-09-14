const express = require("express");
const router = express.Router();
const { submitPayment, verifyPayment } = require("../controllers/paymentController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);

router.post("/", submitPayment);      // for user
router.put("/verify", verifyPayment); // for owner

module.exports = router;
