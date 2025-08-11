const express = require("express");

const router = express.Router();

const { signup, login, doctorSignup, doctorLogin } = require("../controllers/authController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/d-signup").post(doctorSignup);
router.route("/d-login").post(doctorLogin);

module.exports = router;
