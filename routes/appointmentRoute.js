const express = require("express");
const {
  bookAppointment,
  getAllAppointmentsByUser,
  getAllAppointments,
  getAllDoctorAppointments,
  deleteSingleAppointment,
  getSingleAppointment,
  cancelAppointmentByUser,
  confirmAppointmentByUser,
} = require("../controllers/appointmentController");
const { isUserLoggedIn } = require("../middlewares/isUserLoggedIn");
const { isDoctorLoggedIn } = require("../middlewares/isDoctorLoggedIn");
const loggedUser = require("../middlewares/LoggedUser");
const loggedDoctor = require("../middlewares/loggedDoctor");
const router = express.Router();

router.route("/").get(getAllAppointments);
router.route("/book").post(isUserLoggedIn, bookAppointment);
router.route("/userappointments").get(isUserLoggedIn, getAllAppointmentsByUser);
router
  .route("/doctorappointments")
  .get(isDoctorLoggedIn, getAllDoctorAppointments);
router
  .route("/userappointments/:id")
  .delete(isUserLoggedIn, deleteSingleAppointment)
  .get(getSingleAppointment);
router
  .route("/doctorappointments/:id")
  .delete(isDoctorLoggedIn, loggedDoctor, deleteSingleAppointment)
  .get(getSingleAppointment);

router
  .route("/cancel-user-appointment")
  .patch(isUserLoggedIn, cancelAppointmentByUser);

router
  .route("/confirm-appointment")
  .patch(isUserLoggedIn, confirmAppointmentByUser);

router.route("/:id").get(getSingleAppointment);

module.exports = router;
