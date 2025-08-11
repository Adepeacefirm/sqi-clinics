const jwt = require("jsonwebtoken");

const isAdminLoggedIn = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(400).json({
        message: "Please provide token to continue",
      });
      return;
    }

    const decoded = await jwt.verify(token, process.env.jwt_secret_key);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      res.status(403).json({
        status: "error",
        message: "Invalid token",
      });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = isAdminLoggedIn;
