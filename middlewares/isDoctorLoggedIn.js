const doctorModel = require("../models/doctorModel");
const jwt = require("jsonwebtoken");

const isDoctorLoggedIn = async (req, res, next) => {
  let dToken;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      dToken = req.headers.authorization.split(" ")[1];
    }

    if (!dToken) {
      res.status(403).json({
        message: "Please provide token to continue",
      });
      return;
    }

    const decoded = await jwt.verify(dToken, process.env.jwt_secret_key);
    const doctor = await doctorModel.findById(decoded.id);
    req.user = doctor;
    next();
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

module.exports = {
  isDoctorLoggedIn,
};
