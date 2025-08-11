const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../nodemailer/signUpEmail");
const singUpEmail = require("../nodemailer/signUpEmail");
const loginEmail = require("../nodemailer/loginEmail");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      res.status(403).json({
        status: "error",
        message: "User already exists",
      });
      return;
    }
    const user = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "Could not register user",
      });
      return;
    }

    console.log(user);

    singUpEmail(email, name);

    res.status(200).json({
      status: "success",
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("try-catch error detected: user registration: ", error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404).json({
      status: "error",
      message: "Invalid email",
    });
    return;
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    res.status(400).json({
      status: "error",
      message: "Password not correct",
    });
    return;
  }

  //Generate token

  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.jwt_secret_key,
    { expiresIn: process.env.jwt_exp }
  );

  loginEmail(user.name, email);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
  });
};

const doctorSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctorExists = await doctorModel.findOne({ email });
    if (doctorExists) {
      res.status(403).json({
        status: "error",
        message: "Doctor already exists",
      });
      return;
    }
    const doctor = await doctorModel.create({
      ...req.body,
      password: hashedPassword,
    });
    if (!doctor) {
      res.status(404).json({
        status: "error",
        message: "Could not register doctor",
        doctor,
      });
      return;
    }

    singUpEmail(email, name);

    res.status(200).json({
      status: "success",
      message: "doctor signup successful",
      doctor,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

const doctorLogin = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      res.status(200).json({
        status: "error",
        message: "Invalid doctor's email",
      });
      return;
    }

    const passwordCorrect = await bcrypt.compare(password, doctor.password);

    if (!passwordCorrect) {
      res.status(400).json({
        status: "error",
        message: "Incorrect doctor's password",
      });
      return;
    }

    //Generate Token

    const dToken = jwt.sign(
      { email: doctor.email, id: doctor._id },
      process.env.jwt_secret_key,
      { expiresIn: process.env.jwt_exp }
    );

    loginEmail(name, email);

    res.status(200).json({
      status: "success",
      message: "Doctor's login successfull",
      dToken,
    });
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

module.exports = {
  signup,
  login,
  doctorSignup,
  doctorLogin,
};
