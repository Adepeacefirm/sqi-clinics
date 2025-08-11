const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    if (!doctors) {
      res.status(404).json({
        status: "error",
        message: "could not fetch doctors",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "Doctors fetched successfully",
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const getSingleDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      res.status(404).json({
        status: "error",
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "doctor fetched successfully",
      doctor,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const updateSingleDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      res.json({
        status: "error",
        message: "doctor not found",
      });
      rturn;
    }
    res.status(200).json({
      status: "success",
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("try-catch error: ", error.message);
  }
};

const deleteSingleDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findByIdAndDelete(id);
    if (!doctor) {
      res.status(404).json({
        status: "error",
        message: "doctor does not exist",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "Doctor deleted succesfully",
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const getAllAppointmentsByDoctor = async (req, res) => {
  try {
    console.log(req.user);

    const doctorId = req.user._id;
    const appointments = await appointmentModel
      .find({ doctorId })
      .populate("userId", "name image age")
      .populate("doctorId", "name speciality image");
    console.log(appointments);

    if (!appointments) {
      res.status(404).json({
        status: "error",
        message: "No appointment found for this doctor",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      message: "Doctor's appointment fetched successfully",
      appointments,
    });
  } catch (error) {
    console.log(error);
  }
};

const appointmentComplete = async (req, res) => {
  try {
    const { appId } = req.body;

    const appointment = await appointmentModel.findById(appId);
    if (!appointment) {
      res.status(404).json({
        status: "error",
        message: "Appointment doesnt exist",
      });
      return;
    }

    if (appointment.doctorId.toString() !== String(req.user._id)) {
      res.status(400).json({
        status: "error",
        message: "You can only complete your own appointment",
      });
      return;
    }

    await appointmentModel.findByIdAndUpdate(appId, { status: "Completed" });
    res.status(201).json({
      status: "success",
      message: "Appointment completed",
    });
  } catch (error) {
    console.log(error);
  }
};

const undoAppointmentComplete = async (req, res) => {
  const { appId } = req.body;
  try {
    const appointment = await appointmentModel.findById(appId);

    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "Completed") {
      return res.status(400).json({
        status: "error",
        message: "Appointment is not completed, cannot undo.",
      });
    }

    await appointmentModel.findByIdAndUpdate(appId, { status: "Pending" });

    return res.status(200).json({
      status: "success",
      message: "Appointment restored to Scheduled",
    });
  } catch (error) {
    console.log("Undo error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to undo completion",
    });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const appointments = await appointmentModel
      .find({ doctorId })
      .populate("userId", "name age image")
      .populate("doctorId", "name image gender");
    const uniquePatients = await appointmentModel.distinct("userId", {
      doctorId,
    });
    const patientCount = uniquePatients.length;

    const dashData = {
      appointments: appointments.length,
      patients: patientCount,
      latestAppointments: appointments.slice(0, 5),
    };

    res.status(201).json({
      status: "success",
      message: "Doctor dashboard fetched succesfully",
      dashData,
    });
  } catch (error) {
    console.log(error);
  }
};

const doctorProfile = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const profileData = await doctorModel
      .findById(doctorId)
      .select("-password");
    if (!profileData) {
      res.status(404).json({
        status: "error",
        message: "Profile does not exist",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      message: "Profile fetched successfully",
      profileData,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { address, about } = req.body;
    await doctorModel.findByIdAndUpdate(doctorId, { address, about });

    res.status(201).json({
      status: "success",
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const doctorInactive = async (req, res) => {
  const doctorId = req.user._id;
  try {
    const doctor = await doctorModel.findById(doctorId);
    console.log(doctor);

    if (!doctor) {
      res.status(404).json({
        status: "error",
        message: "FUnction does not exist",
      });
      return;
    }
    await doctorModel.findByIdAndUpdate(doctorId, { active: false });

    res.status(200).json({
      status: "success",
      message: "Doctor is now inactive",
      doctor,
    });
  } catch (error) {
    console.log("Caught by try-catch: ", error.message);
  }
};
const doctorActive = async (req, res) => {
  const doctorId = req.user._id;
  try {
    const doctor = await doctorModel.findById(doctorId);
    console.log(doctor);

    if (!doctor) {
      res.status(404).json({
        status: "error",
        message: "FUnction does not exist",
      });
      return;
    }
    await doctorModel.findByIdAndUpdate(doctorId, { active: true });

    res.status(200).json({
      status: "success",
      message: "Doctor is now active",
      doctor,
    });
  } catch (error) {
    console.log("Caught by try-catch: ", error.message);
  }
};

module.exports = {
  getAllDoctors,
  getSingleDoctor,
  updateSingleDoctor,
  deleteSingleDoctor,
  getAllAppointmentsByDoctor,
  appointmentComplete,
  undoAppointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  doctorInactive,
  doctorActive,
};
