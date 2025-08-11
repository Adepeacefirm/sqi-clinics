const appointmentModel = require("../models/appointmentModel");

const loggedUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;
    const appointment = await appointmentModel.findById(id);
    if (!appointment) {
      res.status(404).json({
        message: "Appointment not found",
      });
      return;
    }

    if (appointment.userId.toString() !== String(_id)) {
      res.status(403).json({
        _id,
        appointment,
        message:
          "Unauthorized request: You can only access your own appointments",
      });
      return;
    }
    next();
  } catch (error) {
    console.log("Caught by try-catch: ", error.message);
  }
};

module.exports = loggedUser;
