const express = require("express");
const {
  getAllDoctors,
  getSingleDoctor,
  updateSingleDoctor,
  deleteSingleDoctor,
  getAllAppointmentsByDoctor,
  appointmentComplete,
  undoAppointmentComplete,
  doctorDashboard,
  updateDoctorProfile,
  doctorProfile,
  updateDoctorStatus,
  doctorInactive,
  doctorActive,
} = require("../controllers/doctorController");
const { isDoctorLoggedIn } = require("../middlewares/isDoctorLoggedIn");
const router = express.Router();

router.route("/").get(getAllDoctors);
router
  .route("/doctors/:id")
  .get(getSingleDoctor)
  .patch(updateSingleDoctor)
  .delete(deleteSingleDoctor);

router.route("/appointments").get(isDoctorLoggedIn, getAllAppointmentsByDoctor);

router
  .route("/appointment-complete")
  .patch(isDoctorLoggedIn, appointmentComplete);

router
  .route("/undo-appointment-complete")
  .patch(isDoctorLoggedIn, undoAppointmentComplete);

router.route("/dashboard").get(isDoctorLoggedIn, doctorDashboard);

router.route("/profile").get(isDoctorLoggedIn, doctorProfile);
router.route("/update-profile").patch(isDoctorLoggedIn, updateDoctorProfile);
router.route("/status-inactive").patch(isDoctorLoggedIn, doctorInactive);
router.route("/status-active").patch(isDoctorLoggedIn, doctorActive);

module.exports = router;
