const { createTransport } = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.app_email,
    pass: process.env.app_password,
  },
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Server is ready to send emails");
  } catch (error) {
    console.error("Nodemailer error", error);
  }
};

verifyTransporter();

module.exports = transporter;
