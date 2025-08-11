const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  speciality: {
    type: String,
  },
  experience: {
    type: String,
  },
  university: {
    type: String,
  },
  address: {
    type: String,
  },
  about: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const doctorModel = mongoose.model("doctors", doctorSchema);

module.exports = doctorModel;
