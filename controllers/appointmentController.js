const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const bookAppointmentEmail = require("../nodemailer/bookAppointmentEmail");

const assignDoctor = async (date, time) => {
  const doctors = await doctorModel.find({
    speciality: "General Medicine",
    active: true,
  });

  console.log("Assigning doctor for", date, time);
  console.log("Found doctors:", doctors.length);
  for (const doc of doctors) {
    const isBusy = await appointmentModel.exists({
      doctorId: doc._id,
      date: date,
      time: time,
      status: { $ne: "Cancelled" },
    });
    console.log(`Checking doctor ${doc._id}`);
    console.log(`Is doctor busy?`, isBusy);

    if (!isBusy) {
      return doc._id;
    }
  }
  return null;
};

const bookAppointment = async (req, res) => {
  const { name, email, _id } = req.user;
  const { date, time, complaint } = req.body;
  const userId = req.user._id;
  try {
    const doctorId = await assignDoctor(date, time);
    if (!doctorId) {
      res.status(400).json({
        status: "error",
        message: "No doctor available at that time",
      });
      return;
    }

    const appointment = await appointmentModel.create({
      userId,
      doctorId,
      complaint,
      date,
      time,
    });

    if (!appointment) {
      res.status(403).json({
        status: "error",
        message: "Error creating appointment",
      });
      return;
    }

    bookAppointmentEmail(name, email);

    const populatedAppointment = await appointmentModel
      .findById(appointment._id)
      .populate("userId", "name gender")
      .populate("doctorId", "name speciality");

    res.status(200).json({
      status: "success",
      message: "Appointment created successfully",
      populatedAppointment,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const getAllAppointments = async (req, res) => {
  try {
    // const userId = req.user._id;
    const appointments = await appointmentModel
      .find()
      .populate("doctorId", "name speciality")
      .populate("userId", "name gender");

    if (!appointments) {
      res.status(404).json({
        status: "error",
        message: "No appointments found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "All appointments fetched successfully",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const getAllAppointmentsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointments = await appointmentModel
      .find({ userId })
      .populate("userId", "name gender")
      .populate("doctorId", "name speciality image");
    if (!appointments) {
      res.status(200).json({
        status: "error",
        message: "No appointments found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "User appointments fetched succesfully",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const getAllDoctorAppointments = async (req, res) => {
  console.log(req.user);
  console.log("This ID is ", req.user.id);

  try {
    const appointments = await appointmentModel
      .find({ doctor: req.user.id })
      .populate("doctorId", "name email")
      .populate("userId", "name email");
    if (!appointments) {
      res.status(404).json({
        status: "error",
        message: "No Doctor appointments found",
      });
      return;
    }

    console.log(appointments);

    res.status(200).json({
      status: "success",
      message: "Doctor's appointments fetched succesfully",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const deleteSingleAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await appointmentModel.findByIdAndDelete(id);
    if (!appointment) {
      res.status(404).json({
        status: "error",
        message: "Appointment does not exist",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.log("Caught by try-catch: ", error.message);
  }
};
const cancelAppointmentByUser = async (req, res) => {
  const { appId } = req.body;
  try {
    const appointment = await appointmentModel.findById(appId);
    console.log(appointment);

    if (appointment.userId.toString() !== String(req.user._id)) {
      res.status(400).json({
        status: "error",
        message: "Failed. You can only cancel your own appointments",
      });
      return;
    }
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

const getSingleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentModel
      .findById(id)
      .populate("doctorId", "name email")
      .populate("userId", "name email");

    if (!appointment) {
      res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Appointment fetched successfully",
      appointment,
    });
  } catch (error) {
    console.log("Caught by try-catch: ", error.message);
  }
};


const confirmAppointmentByUser = async (req, res) => {
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
    await appointmentModel.findByIdAndUpdate(appId, { status: "Confirmed" });

    res.status(200).json({
      status: "success",
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log("Caught by try-catch: ", error.message);
  }
};

module.exports = {
  bookAppointment,
  getAllAppointments,
  getAllAppointmentsByUser,
  getAllDoctorAppointments,
  getSingleAppointment,
  deleteSingleAppointment,
  cancelAppointmentByUser,
  confirmAppointmentByUser,
};
