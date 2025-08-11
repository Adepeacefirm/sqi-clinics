const express = require("express");
const {
  addDoctor,
  adminLogin,
  allDoctors,
  getAllAppointmentsByAdmin,
  cancelAppointmentByAdmin,
  adminDashboard,
  undoCancelAppointmentByAdmin,
} = require("../controllers/adminController");
const upload = require("../middlewares/multer");
const isAdminLoggedIn = require("../middlewares/isAdminLoggedIn");

const router = express.Router();

router
  .route("/add-doctor")
  .post(isAdminLoggedIn, upload.single("image"), addDoctor);
router.route("/login").post(adminLogin);
router.route("/all-doctors").get(isAdminLoggedIn, allDoctors);
router
  .route("/all-appointments")
  .get(isAdminLoggedIn, getAllAppointmentsByAdmin);

router
  .route("/cancel-appointment")
  .patch(isAdminLoggedIn, cancelAppointmentByAdmin);

router.route("/dashboard").get(isAdminLoggedIn, adminDashboard);
router.route("/undo-cancel-appointment").patch(isAdminLoggedIn, undoCancelAppointmentByAdmin)

module.exports = router;
