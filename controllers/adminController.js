const validator = require("validator");
const bcrypt = require("bcryptjs");
const doctorModel = require("../models/doctorModel");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");

const addDoctor = async (req, res) => {
  try {
    console.log("adding doc...");

    const { name, email, password, gender } = req.body;
    const imageFile = req.file;
    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    if (!name || !email || !password || !gender) {
      res.status(400).json({
        status: "error",
        message: "Missing details",
      });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({
        status: "error",
        message: "Please enter a valid email",
      });
      return;
    }

    if (password < 5) {
      res.status(300).json({
        status: "error",
        message: "Password must be at least 5 characters",
      });
      return;
    }

    console.log(req.body);

    const doctorExists = await doctorModel.findOne({ email });

    if (doctorExists) {
      res.status(409).json({
        status: "error",
        message: "Error. Doctor already exists",
      });
      return;
    }

    const newDoctor = await doctorModel.create({
      ...req.body,
      password: hashedPassword,
      image: imageUrl,
      date: Date.now(),
    });

    if (!newDoctor) {
      res.status(403).json({
        status: "error",
        message: "Cound not add doctor",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Doctor added succesfully",
      newDoctor,
    });
  } catch (error) {
    console.log("try-catch error: ", error);
    res.json({
      status: "Error",
      message: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL) {
      res.json({
        status: "error",
        message: "invalid admin",
      });
      return;
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      res.json({
        status: "error",
        message: "invalid cridentials",
      });
      return;
    }

    const token = jwt.sign(
      { email: process.env.ADMIN_EMAIL },
      process.env.jwt_secret_key,
      { expiresIn: process.env.jwt_exp }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: error.message,
    });
  }
};

// API To Get All Doctors

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.status(200).json({
      status: "success",
      message: "All doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllAppointmentsByAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("userId", "name gender age image")
      .populate("doctorId", "name speciality image");
    if (!appointments) {
      res.status.json({
        status: "error",
        message: "No appointments found",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      message: "Appointments fetched succesfully",
      appointments,
    });
  } catch (error) {
    console.log(error);
  }
};

const cancelAppointmentByAdmin = async (req, res) => {
  const { appId } = req.body;
  try {
    const appointment = await appointmentModel.findById(appId);
    console.log(appointment);

    if (!appointment) {
      res.status(404).json({
        status: "error",
        message: "Appointment does not exist",
      });
      return;
    }
    await appointmentModel.findByIdAndUpdate(appId, { status: "Cancelled" });

    res.status(200).json({
      status: "success",
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log("Caught by try-catch: ", error.message);
  }
};

const undoCancelAppointmentByAdmin = async (req, res) => {
  const { appId } = req.body;
  try {
    const appointment = await appointmentModel.findById(appId);

    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment does not exist",
      });
    }

    await appointmentModel.findByIdAndUpdate(appId, { status: "Pending" });

    return res.status(200).json({
      status: "success",
      message: "Appointment restored to Pending",
    });
  } catch (error) {
    console.log("Undo error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to undo cancellation",
    });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel
      .find({})
      .populate("doctorId", "name image speciality")
      .populate("userId", "name age gender");

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    if (!dashData) {
      res.status(400).json({
        status: "error",
        message: "No dashData found",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      message: "dashData fetched successfully",
      dashData,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addDoctor,
  adminLogin,
  allDoctors,
  getAllAppointmentsByAdmin,
  cancelAppointmentByAdmin,
  adminDashboard,
  undoCancelAppointmentByAdmin,
};
