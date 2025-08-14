const express = require("express");
const {
  initiatePayment,
  createPayment,
  confirmPayment,
  flutterwaveWebhook,
  payConfirm,
} = require("../controllers/paymentController");

const router = express.Router();

router.route("/pay").post(initiatePayment);
router.route("/create-payment").post(createPayment);
router.route("/confirm-pament").post(confirmPayment);
router.post("/flutterwave-webhook", express.raw({ type: "application/json" }), payConfirm);

module.exports = router;
