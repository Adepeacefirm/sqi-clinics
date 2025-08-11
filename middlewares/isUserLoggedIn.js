const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isUserLoggedIn = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(403).json({
        message: "Please provide token to continue",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.jwt_secret_key);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      res.status(404).json({
        message: "User does not exist",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("try-catch error: ", error);
  }
};

module.exports = {
  isUserLoggedIn,
};
