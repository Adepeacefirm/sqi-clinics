const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  getUserProfile,
  updateUserProfile,
  confirmAppointmentByUser,
} = require("../controllers/userController");
const { isUserLoggedIn } = require("../middlewares/isUserLoggedIn");
const upload = require("../middlewares/multer");
const router = express.Router();

router.route("/").get(getAllUsers);
router
  .route("/user/:id")
  .get(getSingleUser)
  .patch(updateSingleUser)
  .delete(deleteSingleUser);

router.route("/get-profile").get(isUserLoggedIn, getUserProfile);
router
  .route("/update-profile")
  .post(isUserLoggedIn, upload.single("image"), updateUserProfile);

module.exports = router;
