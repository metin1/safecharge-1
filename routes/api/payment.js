const express = require("express");
const router = express.Router();
const {
  createPayment,
  executePayment,
  openPayment
} = require("../../controllers/paymentController");
const { auth } = require("../../middlewares/authorization");
const { tokenCartItems } = require("../../middlewares/cartToken");

router.post("/create-payment/:token", createPayment);
router.post("/execute-payment/:token", executePayment);
router.post("/open-payment/", openPayment);

module.exports = router;
