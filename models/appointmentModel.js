const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctors",
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
    default: "Pending",
  },
  complaint: {
    type: String,
  },
  time: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  paymentRef: {
    type: String,
  },
});

const appointmentModel = mongoose.model("appointments", appointmentSchema);

module.exports = appointmentModel;
