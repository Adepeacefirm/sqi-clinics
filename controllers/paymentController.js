const axios = require("axios");
const appointmentModel = require("../models/appointmentModel");

const initiatePayment = async (req, res) => {
  const { email, name } = req.body;
  const { appointmentId } = req.params;

  const data = {
    tx_ref: `tx-${Date.now()}`,
    amount: 50,
    currency: "USD", // Fixed $50
    customer: {
      email,
      name,
    },
    customizations: {
      title: "Doctor Appointment",
      description: "Payment for doctor's appointment",
    },
    redirect_url: "http://localhost:5173/myappointments",
    // payment_options is omitted so Flutterwave uses all available ones
  };

  try {
    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      paymentRef: data.tx_ref,
      status: "Pending Payment",
    });

    const { link } = response.data.data;
    return res.status(200).json({ link });
  } catch (error) {
    console.error("Flutterwave error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Payment initiation failed" });
  }
};

const createPayment = async (req, res) => {
  try {
    const { userId, doctorId, date } = req.body;

    // Generate unique tx_ref for this payment
    const txRef = `tx-${Date.now()}`;

    // Create appointment with "Pending" status
    const appointment = await Appointment.create({
      userId,
      doctorId,
      date,
      status: "Pending",
      txRef,
    });

    res.json({
      message: "Appointment created, proceed to payment",
      txRef,
      appointment,
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const confirmPayment = async (req, res) => {
  const { transactionId } = req.body;
  try {
    const verifyRes = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, // Your Flutterwave Secret Key
        },
      }
    );
    const payment = verifyRes.data.data;
    if (
      payment.status === "successful" &&
      payment.amount === 50 && // match your fixed price
      payment.currency === "USD" // match your currency
    ) {
      // Update appointment
      await Appointment.findOneAndUpdate(
        { txRef: payment.tx_ref },
        { status: "Confirmed" }
      );
      return res.json({ message: "Appointment confirmed", payment });
    } else {
      return res.status(400).json({ message: "Invalid payment" });
    }
  } catch (error) {
    console.error(
      "Error verifying payment:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Payment verification failed" });
  }
};
const flutterwaveWebhook = async (req, res) => {
  try {
    // 1️⃣ Verify Flutterwave signature
    const secretHash = process.env.FLW_WEBHOOK_SECRET; // set in Flutterwave dashboard
    const signature = req.headers["verif-hash"];
    if (!signature || signature !== secretHash) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = req.body;

    // 2️⃣ Check payment status
    if (payload.status === "successful") {
      const txId = payload.data.id;

      // 3️⃣ Verify payment with Flutterwave API
      const verifyResponse = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${txId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          },
        }
      );

      const verifyData = verifyResponse.data.data;

      if (
        verifyData.status === "successful" &&
        verifyData.amount === 50 &&
        verifyData.currency === "USD"
      ) {
        // 4️⃣ Update appointment in DB
        await appointmentModel.findOneAndUpdate(
          { tx_ref: verifyData.tx_ref },
          { status: "Confirmed" }
        );
        console.log("Appointment confirmed:", verifyData.tx_ref);
      }
    }

    res.sendStatus(200); // Acknowledge webhook
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.sendStatus(500);
  }
};

const payConfirm = async (req, res) => {
  const secretHash = process.env.FLW_WEBHOOK_SECRET; // set this in your Flutterwave dashboard
  const signature = req.headers["verif-hash"];
  console.log(signature);
  console.log(secretHash);
  // Verify webhook source
  if (!signature || signature !== secretHash) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const payload = JSON.parse(req.body.toString());
  console.log("Webhook received:", payload);

  if (
    payload.status === "successful" &&
    payload.currency === "USD" &&
    payload.amount === 50
  ) {
    const txRef = payload.tx_ref;
    const verifyRes = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const verification = verifyRes.data;
    if (
      verification.status === "success" &&
      verification.data.status === "successful"
    ) {
      console.log("✅ Payment verified for:", txRef);

      // Update appointment status
      await appointmentModel.findOneAndUpdate(
        { paymentRef: txRef },
        { status: "Confirmed" }
      );
    }
  }

  res.status(200).send("Webhook received successfully");
};

module.exports = {
  initiatePayment,
  createPayment,
  confirmPayment,
  flutterwaveWebhook,
  payConfirm,
};
