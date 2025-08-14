const express = require("express");
const {
  initiatePayment,
  createPayment,
  confirmPayment,
  flutterwaveWebhook,
  payConfirm,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/flutterwave-webhook", payConfirm);
router.route("/pay/:appointmentId").post(initiatePayment);
router.route("/pay/paystack/:appointmentId").post(initiatePayment);
router.route("/create-payment").post(createPayment);
router.route("/confirm-pament").post(confirmPayment);

module.exports = router;
