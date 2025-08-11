const appointmentModel = require("../models/appointmentModel");

const loggedDoctor = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { appId } = req.params;
    const appointment = await appointmentModel.findById(appId);
    if (!appointment) {
      res.status(404).json({
        message: "Appointment not found",
      });
      return;
    }

    if (appointment.doctor.toString() !== id) {
      res.status(403).json({
        message:
          "Unauthorized request: You can only access your own appointments",
      });
      return;
    }
  } catch (error) {
    console.log("Caught by try-catch: ", error.message);
  }
};

module.exports = loggedDoctor;
